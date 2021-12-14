document.addEventListener("DOMContentLoaded", function () {
  /* firebase initialization */
  const config = {
    apiKey: "AIzaSyAXY5BZov65lRkWhuST_73DN7edHGLIjkU",
    authDomain: "todolistproject-f1fa1.firebaseapp.com",
    projectId: "todolistproject-f1fa1",
    storageBucket: "todolistproject-f1fa1.appspot.com",
    messagingSenderId: "226876251544",
    appId: "1:226876251544:web:42313083b54e756308dfed",
    /* The configuration from Firebase console. */
  };

  const firebaseApp = firebase.initializeApp(config);
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();

  /* DOM elements */
  var c_sign_in = document.getElementById("sign_in");
  var f_sign_in = document.getElementById("sign_in");
  var s_email = document.getElementById("s_email");
  var s_password = document.getElementById("s_password");

  var c_login = document.getElementById("login");
  var f_login = document.getElementById("f_login");
  var l_email = document.getElementById("l_email");
  var l_password = document.getElementById("l_password");

  var msg = document.getElementById("msg");

  var u_email = document.getElementById("u_email");
  var u_logout = document.getElementById("u_logout");

  var c_todo = document.getElementById("todo");
  var t_title = document.getElementById("t_title");
  var f_todo = document.getElementById("f_todo");
  var d_todo = document.getElementById("d_todo");

  var user;

  /* Get tasks per user */
  var getTasks = async function () {
    var snapshot = await db.collection(`users/${user.uid}/tasks`).get();
    d_todo.innerHTML = "";
    snapshot.forEach((doc) => {
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(doc.data().title));
      li.setAttribute("id", doc.id);
      doc.data().status ? li.setAttribute("class", "complete") : null;

      /* Remove task */
      li.addEventListener("dblclick", function (event) {
        db.collection(`users/${user.uid}/tasks`)
          .doc(event.target.id)
          .delete()
          .then(() => {
            msg.innerText = "The task has been successfully removed.";
            getTasks();
          })
          .catch((error) => {
            msg.innerText = `${error.code} (${error.message})`;
          });
      });

      /* Complete task */
      li.addEventListener("click", function (event) {
        db.collection(`users/${user.uid}/tasks`)
          .doc(event.target.id)
          .update({
            status: !doc.data().status,
          })
          .then(() => {
            msg.innerText = "The task has been successfully updated.";
            getTasks();
          })
          .catch((error) => {
            msg.innerText = `${error.code} (${error.message})`;
          });
      });

      d_todo.appendChild(li);
    });
  };

  /* User registration */
  f_sign_in.addEventListener("submit", function (event) {
    event.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(s_email.value, s_password.value)
      .then((userCredential) => {
        user = userCredential.user;
        msg.innerText = `The user (${user.email}) has been successfully created.`;

        c_login.style.display = "none";
        c_sign_in.style.display = "none";

        u_email.innerText = user.email;
        u_logout.style.display = "block";
        c_todo.style.display = "block";

        s_email.value = "";
        s_password.value = "";
      })
      .catch((error) => {
        msg.innerText = `${error.code} (${error.message})`;
      });
  });

  /* User login */
  f_login.addEventListener("submit", function () {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(l_email.value, l_password.value)
      .then((userCredential) => {
        user = userCredential.user;
        msg.innerText = `The user (${user.email}) has been successfully login.`;

        c_login.style.display = "none";
        c_sign_in.style.display = "none";

        u_email.innerText = user.email;
        u_logout.style.display = "block";
        c_todo.style.display = "block";

        l_email.value = "";
        l_password.value = "";

        getTasks();
      });
  });

  /* User logout */
  b_logout.addEventListener("click", function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        msg.innerText = "The user has been successfully logout.";

        c_login.style.display = "block";
        c_sign_in.style.display = "block";

        u_email.innerText = "";
        u_logout.style.display = "none";
        c_todo.style.display = "none";
      })
      .catch((error) => {
        msg.innerText = `${error.code} (${error.message})`;
      });
  });

  /* Add task */
  f_todo.addEventListener("submit", function () {
    event.preventDefault();
    db.collection(`users/${user.uid}/tasks`)
      .doc(uuid.v4())
      .set({
        title: t_title.value,
        status: false,
      })
      .then(() => {
        msg.innerText = "The new task has been successfully added.";
        t_title.value = "";
        getTasks();
      })
      .catch((error) => {
        msg.innerText = `${error.code} (${error.message})`;
      });
  });
});
