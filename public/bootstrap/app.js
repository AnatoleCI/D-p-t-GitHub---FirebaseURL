document.addEventListener("DOMContentLoaded", function () {
  /* firebase initialization */
  const config = {
    /* The configuration from Firebase console. */
  };

  const firebaseApp = firebase.initializeApp(config);
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();

  /* DOM elements */
  var c_sign_in = document.getElementById("sign_in");
  var f_sign_in = document.getElementById("f_sign_in");
  var s_email = document.getElementById("s_email");
  var s_password = document.getElementById("s_password");
  var s_alert = document.getElementById("s_alert");

  var c_login = document.getElementById("login");
  var f_login = document.getElementById("f_login");
  var l_email = document.getElementById("l_email");
  var l_password = document.getElementById("l_password");
  var l_alert = document.getElementById("l_alert");

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
      doc.data().status
        ? li.setAttribute("class", "list-group-item complete")
        : li.setAttribute("class", "list-group-item");

      /* Remove task */
      li.addEventListener("dblclick", function (event) {
        t_alert.className = "alert";

        db.collection(`users/${user.uid}/tasks`)
          .doc(event.target.id)
          .delete()
          .then(() => {
            t_alert.classList.add("alert-success");
            t_alert.innerText = "The task has been successfully removed.";
            t_alert.style.display = "block";
            getTasks();
          })
          .catch((error) => {
            t_alert.classList.add("alert-danger");
            t_alert.innerText = `${error.code} (${error.message})`;
            t_alert.style.display = "block";
          });
      });

      /* Complete task */
      li.addEventListener("click", function (event) {
        t_alert.className = "alert";

        db.collection(`users/${user.uid}/tasks`)
          .doc(event.target.id)
          .update({
            status: !doc.data().status,
          })
          .then(() => {
            t_alert.classList.add("alert-success");
            t_alert.innerText = "The task has been successfully updated.";
            t_alert.style.display = "block";
            getTasks();
          })
          .catch((error) => {
            t_alert.classList.add("alert-danger");
            t_alert.innerText = `${error.code} (${error.message})`;
            t_alert.style.display = "block";
          });
      });

      d_todo.appendChild(li);
    });
  };

  /* Add task */
  var addTask = function (event) {
    event.preventDefault();
    t_alert.className = "alert";

    db.collection(`users/${user.uid}/tasks`)
      .doc(uuid.v4())
      .set({
        title: t_title.value,
        status: false,
      })
      .then(() => {
        t_alert.classList.add("alert-success");
        t_alert.innerText = "The new task has been successfully added.";
        t_alert.style.display = "block";
        getTasks();
        t_title.value = "";
      })
      .catch((error) => {
        t_alert.classList.add("alert-danger");
        t_alert.innerText = `${error.code} (${error.message})`;
        t_alert.style.display = "block";
      });
  };

  /* User registration */
  var sign_in = function (event) {
    event.preventDefault();

    firebase
      .auth()
      .createUserWithEmailAndPassword(s_email.value, s_password.value)
      .then((userCredential) => {
        user = userCredential.user;

        c_login.style.display = "none";
        c_sign_in.style.display = "none";

        u_email.innerText = user.email;
        c_todo.style.display = "block";

        s_email.value = "";
        s_password.value = "";
        t_alert.style.display = "none";

        getTasks();
      })
      .catch((error) => {
        s_alert.innerText = `${error.code} (${error.message})`;
        s_alert.style.display = "block";
      });
  };

  /* User login */
  var login = function () {
    event.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(l_email.value, l_password.value)
      .then((userCredential) => {
        user = userCredential.user;

        c_login.style.display = "none";
        c_sign_in.style.display = "none";

        u_email.innerText = user.email;
        c_todo.style.display = "block";

        l_email.value = "";
        l_password.value = "";
        t_alert.style.display = "none";

        getTasks();
      })
      .catch((error) => {
        s_alert.innerText = `${error.code} (${error.message})`;
        s_alert.style.display = "block";
      });
  };

  /* User logout */
  var logout = function () {
    firebase
      .auth()
      .signOut()
      .then(() => {
        c_login.style.display = "block";
        c_sign_in.style.display = "block";

        u_email.innerText = "";
        c_todo.style.display = "none";
      })
      .catch((error) => {
        t_alert.innerText = `${error.code} (${error.message})`;
        t_alert.style.display = "block";
      });
  };

  /* Events */
  f_sign_in.addEventListener("submit", sign_in);
  f_login.addEventListener("submit", login);
  u_logout.addEventListener("click", logout);
  f_todo.addEventListener("submit", addTask);
});
