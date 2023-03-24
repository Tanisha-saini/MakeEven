import {
  app,
  database,
  auth,
  onAuthStateChanged,
  doc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "./config.js";
const user = auth.currentUser;
import { onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";
var sid;
var rid;

function getlastdata(chatid, msg, time) {
  const item = document.getElementById(chatid);
  // console.log(item.innerText);
  const div = item.parentElement;
  const fdiv = div.children[2];
  const m = fdiv.children[1];
  m.innerText = msg;
  const sdiv = div.children[3];
  const t = sdiv.children[0];
  t.innerText = time;
}

function addfriend(name, senderid, rcvrid, picurl, time, msg) {
  const list = document.getElementById("users_list");
  const friend = document.createElement('li');
  friend.setAttribute("class", "user");
  const id = document.createElement('span');
  var i = senderid + rcvrid;
  id.setAttribute('id', i);
  // id.innerText = senderid + rcvrid;
  id.style.display = "none";

  const pic = document.createElement('img');
  pic.setAttribute('src', picurl);
  pic.setAttribute('id', 'user_pic');
  //firstdiv
  const firstdiv = document.createElement('div')
  firstdiv.setAttribute('id', 'user_details');
  const fname = document.createElement('span');
  fname.setAttribute('id', 'user_name');
  fname.innerText = name;
  const last_message = document.createElement('span')
  last_message.setAttribute("id", "last_message");
  last_message.innerText = msg;
  firstdiv.appendChild(fname);
  firstdiv.appendChild(last_message);
  //second div
  const seconddiv = document.createElement('div');
  seconddiv.setAttribute('id', 'seconddiv');
  const last_time = document.createElement('span');
  last_time.setAttribute("id", 'last_time');
  last_time.innerText = time;
  seconddiv.appendChild(last_time);
  // const fuid=document.createElement('span');
  // fuid.innerText="uid";
  // fuid.style.display="none";
  // getlasttime(senderid,rcvrid);
  friend.appendChild(id);
  friend.appendChild(pic);
  friend.appendChild(firstdiv);
  friend.appendChild(seconddiv);
  // friend.appendChild(fname);
  // friend.appendChild(fuid);
  list.appendChild(friend);
  const left = document.getElementById("left_body");
  const frame = document.querySelector("iframe");
  var screenwidth = window.screen.width;
  // if(screenwidth<450){
  //     left.style.width="100%";
  //     frame.style.display="none";
  // }
  friend.addEventListener("click", () => {
    sid = senderid;
    rid = rcvrid;
    // localStorage["sid"] = sid;
    // localStorage["rid"] = rid;
    // localStorage["sname"]=name;

    frame.src = "chatright.html?" + sid + "|" + rid + "|" + name;
    // frame.style.display = "block";
    // if (screenwidth < 450) {
    //     frame.style.width = "100%";

    //     left.style.display="none";
    // }

    // friendwindow(name, senderid, rcvrid)
  })

}

function frchats(userid) {
  const q = query(collection(database, "friendchat"), where("parentid", "==", userid));
  getDocs(q)
    .then((querySnapshot) => {
      querySnapshot.forEach(async (docdata) => {
        const docRef = doc(database, "friendchat", docdata.id);
        const fids = docdata.data().friendids;
        console.log(fids.length);
        console.log(fids);
        for (let i = 0; i < fids.length; i++) {
          let name = fids[i].fname;
          var url;
          const q1 = await query(collection(database, "users"), where("uid", "==", fids[i].fid));
          await getDocs(q1)
            .then((snap) => {
              snap.forEach((doc) => {
                // console.log(doc.data());
                url = doc.data().profilephotourl;
              })
            })
          // console.log(url);
          const chatid = userid + fids[i].fid;
          var time = "";
          var msgval = "";
          const q = await query(collection(database, "chats"), where("chatid", "==", chatid));
          await getDocs(q).then(async (snap) => {
            console.log("getdoc");
            await snap.forEach(async (docdata) => {
              if (!snap.empty) {
                var obj = docdata.data().chat;
                var len = obj.length;
                if (len != 0) {
                  msgval = obj[len - 1].msg;
                  time = obj[len - 1].time;
                  console.log(msgval);
                  console.log(time);
                }
              }
            })
          })
          addfriend(name, userid, fids[i].fid, url, time, msgval);
        }
      })
    })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    const q = query(
      collection(database, "users"),
      where("uid", "==", user.uid)
    );
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((docdata) => {
        if (!docdata.data().formsubmitted) {
          alert("You need to make your profile first");
          window.location.href = "editprofile.html";
        }

        const q = query(
          collection(database, "friendchat"),
          where("parentid", "==", user.uid)
        );
        if (getDocs(q)) {
          console.log("in if");
        } else {
          console.log("else");
        }
        frchats(user.uid);
      });
    });
  } else {
    alert("Login first");
    window.location.href = "login.html";
  }


  const q = query(collection(database, "chats"), where("senderid", "==", user.uid));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // console.log(sid);
    // console.log(rid);
    console.log("on snapshot");
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        console.log("New chat: ", change.doc.data());
      }
      if (change.type === "modified") {
        console.log("New chat: ", change.doc.data());
        var obj = change.doc.data().chat;
        var len = obj.length;
        var msgval = obj[len - 1].msg;
        var time = obj[len - 1].time;
        var cid = change.doc.data().chatid;
        console.log(msgval);
        console.log(time);
        getlastdata(cid, msgval, time);
      }
      if (change.type === "removed") {
        console.log("Removed chat: ", change.doc.data());
      }
    });
  });

});

const inp = document.querySelector("#search_user");
inp.addEventListener("keyup", (e) => {
  let filter = e.target.value.toUpperCase();
  let list = document.querySelectorAll("#users_list .user");
  for (var i = 0; i < list.length; i++) {
    let match = list[i].getElementsByTagName("span")[1];
    let textValue = match.textContent || match.innerHTML;
    if (textValue.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = "";
    } else {
      list[i].style.display = "none";
    }
  }
});

// console.log(u);
// const q = query(collection(database, "chats"), where("senderid", "==", u.uid));
// const unsubscribe = onSnapshot(q, (snapshot) => {
//   // console.log(sid);
//   // console.log(rid);
//   console.log("on snapshot");
//   snapshot.docChanges().forEach((change) => {
//     if (change.type === "added") {
//       console.log("New chat: ", change.doc.data());
//     }
//     if (change.type === "modified") {
//       console.log("New chat: ", change.doc.data());
//       // var obj = change.doc.data().chat;
//       // var len = obj.length;
//       // var msgval = obj[len - 1].msg;
//       // var time = obj[len - 1].time;
//       // console.log(msgval);
//       // console.log(time);
//     }
//     if (change.type === "removed") {
//       console.log("Removed chat: ", change.doc.data());
//     }
//   });
// });