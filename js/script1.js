
function formattedDate(d = new Date) {
  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());


  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return `${year}/${month}/${day}`;
}


async function ChangeDate(elem, mess) {

  if (document.querySelectorAll('td.active').length != 0) {
    document.querySelector('td.active').setAttribute("class", "days");
  }
  if (elem != null) {
    if (!elem.classList.contains("today")) elem.setAttribute("class", "active");
  }


  let apps = [];
  let keys = [];
  let ref = firebase.database().ref(`mydb/appointments`);

  let user = firebase.auth().currentUser;
  let uid;
  let date;
  if (user != null) {
    uid = user.uid;
  }
  date = new Date(`${mess}`);
  sessionStorage.currentdate = formattedDate(date);

  await ref.once("value").then(function (arr) {
    uid = firebase.auth().currentUser.uid;
    arr.forEach(function (item) {

      let app = item.val();

      if (uid == app.uid && date.getDate() == (new Date(app.date1)).getDate()) {
        apps.push(app);
        keys.push(item.key);
      }
      else {
        // alert(date);
        //alert(new Date(app.date1));
      }
    });
  });

  var count = 0;
  document.querySelector('#listapp').innerHTML = "";


  if (apps.length != 0) {
    apps.forEach((element) => {

      var li = document.createElement("li");
      var input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("class", "hide");
      input.setAttribute(`id`, `hd${count}`);
      var label = document.createElement("label");
      label.setAttribute("for", `hd${count}`);
      label.innerText = element.title;
      var div = document.createElement("div");
      label.setAttribute("for", `hd${count}`);
      var p = document.createElement("p");
      p.innerText = element.description;
      div.appendChild(p);
      var p = document.createElement("p");
      p.innerText = formattedDate(new Date(element.date1)) + "  " + element.time1 + " - " + element.time2;
      div.appendChild(p);
      var p = document.createElement("p");
      p.innerText = "Место: " + element.place;
      div.appendChild(p);


      button = document.createElement("button");
      button.setAttribute("class", "b-little");
      button.innerText = "Редакт";
      button.setAttribute("onClick", `ReplaceToEditApp('${keys[apps.indexOf(element)]}')`);
      div.appendChild(button);



      button = document.createElement("button");
      button.setAttribute("class", "b-little");
      button.innerText = "Удалить";
      button.setAttribute("onClick", `DeleteApp('${keys[apps.indexOf(element)]}')`);
      div.appendChild(button);
      

      let div1 = document.createElement("div");
      let label1=document.createElement("label");
      label1.setAttribute("for","active");
      label1.innerText="Статус";
      checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("class", "check1");
      checkbox.setAttribute("id", "active");
      if (element.active) checkbox.removeAttribute("checked");
      else checkbox.setAttribute("checked", "checked");
      checkbox.setAttribute("onClick", `ChangeStateApp('${keys[apps.indexOf(element)]}')`);
      div1.appendChild(checkbox);
      div1.appendChild(label1);
      div.appendChild(div1);

      li.appendChild(input);
      li.appendChild(label);
      li.appendChild(div);

      count++;
      document.querySelector('#listapp').appendChild(li);

    })
  }
  else {
    var li = document.createElement("li");
    li.innerText = "Нет событий";
    document.querySelector('#listapp').appendChild(li);
  }
}

async function ShowAllApps() {
  let apps = [];
  let keys = [];
  let ref = firebase.database().ref(`mydb/appointments`);
  let uid;

  await ref.once("value").then(function (arr) {
    uid = firebase.auth().currentUser.uid;
    arr.forEach(function (item) {
      let app = item.val();
      if (uid == app.uid) {
        apps.push(app);
        keys.push(item.key);
      }
    });
  });

  var count = 0;
  document.querySelector('#listapp').innerHTML = "";



  if (apps.length != 0) {
    apps.forEach((element) => {

      var li = document.createElement("li");
      var input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("class", "hide");
      input.setAttribute(`id`, `hd${count}`);
      var label = document.createElement("label");
      label.setAttribute("for", `hd${count}`);
      label.innerText = element.title;
      var div = document.createElement("div");
      label.setAttribute("for", `hd${count}`);
      var p = document.createElement("p");
      p.innerText = element.description;
      div.appendChild(p);
      var p = document.createElement("p");
      p.innerText = formattedDate(new Date(element.date1)) + "  " + element.time1 + " - " + element.time2;
      div.appendChild(p);
      var p = document.createElement("p");
      p.innerText = "Место: " + element.place;
      div.appendChild(p);


      button = document.createElement("button");
      button.setAttribute("class", "b-little");
      button.innerText = "Редакт";
      button.setAttribute("onClick", `ReplaceToEditApp('${keys[apps.indexOf(element)]}')`);
      div.appendChild(button);



      button = document.createElement("button");
      button.setAttribute("class", "b-little");
      button.innerText = "Удалить";
      button.setAttribute("onClick", `DeleteAppFromAllApps('${keys[apps.indexOf(element)]}')`);
      div.appendChild(button);

      checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("class", "check1");
      checkbox.setAttribute("id", "active");
      if (element.active) checkbox.removeAttribute("checked");
      else checkbox.setAttribute("checked", "checked");
      checkbox.setAttribute("onClick", `ChangeStateApp('${keys[apps.indexOf(element)]}')`);
      div.appendChild(checkbox);

      li.appendChild(input);
      li.appendChild(label);
      li.appendChild(div);

      count++;
      document.querySelector('#listapp').appendChild(li);

    })
  }
  else {
    var li = document.createElement("li");
    li.innerText = "Нет событий";
    document.querySelector('#listapp').appendChild(li);
  }

}

async function ChangeStateApp(id) {

  let ref = firebase.database().ref(`mydb/appointments/${id}/active`);
  let state = false;
  await ref.once("value").then(function (item) {
    state = item.val();
    state = state ? false : true;
  })

  await ref.set(state).then(function () {
    console.log("Change state succeeded.")
  })
    .catch(function (error) {
      console.log("Change failed: " + error.message)
    });
}



function DeleteApp(id) {

  let ref = firebase.database().ref(`mydb/appointments/${id}`);
  ref.remove().then(function () {
    console.log("Remove succeeded.")
  })
    .catch(function (error) {
      console.log("Remove failed: " + error.message)
    });
  ChangeDate(null, sessionStorage.currentdate);
}

function DeleteAppFromAllApps(id) {

  let ref = firebase.database().ref(`mydb/appointments/${id}`);
  ref.remove().then(function () {
    console.log("Remove succeeded.")
  })
    .catch(function (error) {
      console.log("Remove failed: " + error.message)
    });
  ShowAllApps();
}

async function EditApp() {

  var id = sessionStorage.currentidapp;
  let ref = firebase.database().ref(`mydb/appointments/${id}`);
  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var date1 = document.getElementById("date1").value;
  var time1 = document.getElementById("time1").value;
  var time2 = document.getElementById("time2").value;
  var place = document.getElementById("place").value;
  var color = document.getElementById("color").value;
  if (title === "" || description === "" || date1 === "" || time1 === "" || time2 === "" || place === "" || color === "") {
    return;
  }
  var rems = [];
  count = 0;
  while (true) {
    if (document.querySelectorAll(`#idlist${count}`).length != 0) {
      if (document.querySelector(`#idlist${count}`).value == "") {
        alert("Установите время напоминания");
        count++;
        rems = [];
      }
      else {
        rems.push(document.querySelector(`#idlist${count}`).value);
        count++;
      }
    }
    else break;
  }


  let uid = firebase.auth().currentUser.uid;
  let active = true;

  let app = {
    title: title,
    description: description,
    date1: date1,
    time1: time1,
    time2: time2,
    place: place,
    reminders: rems,
    color: color,
    uid: uid,
    active: active,
  };
  await ref.set(app).then((success) => {
    console.log("Edit succeeded.")
    window.location.replace("../pages/calendar.html");
  }).catch((error) => {
    console.log("Edit failed: " + error.message)
  });

}
async function ReplaceToEditApp(id) {
  sessionStorage.currentidapp = id;
  let ref = firebase.database().ref(`mydb/appointments/${id}`);
  await ref.once("value").then(function (item) {
    let app = item.val();
    sessionStorage.title = app.title;
    sessionStorage.description = app.description;
    sessionStorage.date1 = app.date1;
    sessionStorage.time1 = app.time1;
    sessionStorage.time2 = app.time2;
    sessionStorage.place = app.place;
    sessionStorage.color = app.color;
  }).catch((error) => {
    console.log("Error: " + error.message);
    alert(error.message);
  })

  window.location.replace('./editappointment.html');

}


function ReplaceToAddApp() {
  window.location.replace('./addappointment.html');

}


function AddAppointment() {

  var title = document.getElementById("title").value;
  var description = document.getElementById("description").value;
  var date1 = document.getElementById("date1").value;
  var time1 = document.getElementById("time1").value;
  var time2 = document.getElementById("time2").value;
  var place = document.getElementById("place").value;
  var color = document.getElementById("color").value;

  var rems = [];
  count = 0;
  while (true) {
    if (document.querySelectorAll(`#idlist${count}`).length != 0) {
      if (document.querySelector(`#idlist${count}`).value == "") {
        alert("Установите время напоминания");
        count++;
        rems = [];
      }
      else {
        rems.push(document.querySelector(`#idlist${count}`).value);
        count++;
      }
    }
    else break;
  }

  if (title === "" || description === "" || date1 === "" || time1 === "" || time2 === "" || place === "" || color === "") {
    return;
  }



  let uid = firebase.auth().currentUser.uid;
  let active = true;

  let app = {
    title: title,
    description: description,
    date1: date1,
    time1: time1,
    time2: time2,
    place: place,
    reminders: rems,
    color: color,
    uid: uid,
    active: active,
  };

  let id = `f${(+new Date).toString(16)}`;
  firebase.database().ref(`mydb/appointments/${id}`).set(app).then((success) => {
    console.log("Add succeeded.")
    window.location.replace("../pages/calendar.html");
  }).catch((error) => {
    console.log("Add failed: " + error.message)
  });

}



function calendar(id, year, month) {
  var Dlast = new Date(year, month + 1, 0).getDate(),
    D = new Date(year, month, Dlast),
    DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
    DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
    calendar = '<tr>',
    month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  var calendar1 = document.createElement("tbody");
  var tr1 = document.createElement("tr");
  var td = document.createElement("td");
  if (DNfirst != 0) {
    for (var i = 1; i < DNfirst; i++) {
      td = document.createElement("td");
      tr1.appendChild(td);
    }
  }
  else {
    for (var i = 0; i < 6; i++) {
      td = document.createElement("td");
      tr1.appendChild(td);
    }
  }
  var CurrentDateString;
  for (var i = 1; i <= Dlast; i++) {
    CurrentDateString = D.getFullYear() + "/" + ('0' + (D.getMonth() + 1)).slice(-2) + "/" + ('0' + `${i}`).slice(-2);


    if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
      td = document.createElement("td");
      td.setAttribute("class", "today days");
      td.setAttribute("onClick", `ChangeDate(this,'${CurrentDateString}')`);
      //td.addEventListener('click',ChangeDate(this,`${CurrentDateString}`),false);
      td.innerText = i;
      tr1.appendChild(td);
      //calendar += `<td class="today days" onClick=ChangeDate('${CurrentDateString}')>` + i;
    } else {
      //calendar += `<td class="days" onClick=ChangeDate('${CurrentDateString}')>` + i;
      td = document.createElement("td");
      td.setAttribute("class", "days");

      //td.onclick=function(){alert("sfd");};
      //td.addEventListener("click",function(){ChangeDate(this,`${CurrentDateString}`)});
      td.setAttribute("onClick", `ChangeDate(this,'${CurrentDateString}')`);
      td.innerText = i;
      tr1.appendChild(td);
    }
    if (new Date(D.getFullYear(), D.getMonth(), i).getDay() == 0) {
      calendar1.appendChild(tr1);
      tr1 = document.createElement("tr");
    }
  }
  for (var i = DNlast; i < 7; i++) {
    td = document.createElement("td");
    td.innerText = '  ';
    tr1.appendChild(td);
  }

  calendar1.appendChild(tr1);
  document.getElementById('calendarbody').innerHTML = " ";
  document.getElementById('calendarbody').innerHTML = calendar1.innerHTML;
  document.querySelector('#' + id + ' thead td:nth-child(2)').innerHTML = month[D.getMonth()] + ' ' + D.getFullYear();
  document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
  document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();
  if (document.querySelectorAll('.calendarbody tr').length < 6) {  // чтобы при перелистывании месяцев не "подпрыгивала" вся страница, добавляется ряд пустых клеток. Итог: всегда 6 строк для цифр
    document.getElementById('calendarbody').innerHTML += '<tr><td> <td> <td> <td> <td> <td> <td> </tr>';
  }
}



