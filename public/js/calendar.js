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
    CurrentDateString = D.getFullYear() + "-" + ('0' + (D.getMonth() + 1)).slice(-2) + "-" + ('0' + `${i}`).slice(-2);


    if (i == new Date().getDate() && D.getFullYear() == new Date().getFullYear() && D.getMonth() == new Date().getMonth()) {
      td = document.createElement("td");
      td.setAttribute("class", "today days");
      //td.setAttribute("onClick", `ChangeDate(this,'${CurrentDateString}')`);
      //td.addEventListener('click',ChangeDate(this,`${CurrentDateString}`),false);
      td.innerText = i;
      tr1.appendChild(td);
      //calendar += `<td class="today days" onClick=ChangeDate('${CurrentDateString}')>` + i;
    } else {
      //calendar += `<td class="days" onClick=ChangeDate('${CurrentDateString}')>` + i;
      td = document.createElement("td");
      td.setAttribute("class", "days");

      //td.onclick=function(){alert("sfd");};
      //td.addEventListener("click",Hello,false);
      //td.addEventListener("click",function(){ChangeDate(this,`${CurrentDateString}`)});
      //td.setAttribute("onClick", `ChangeDate(this,'${CurrentDateString}')`);
      td.setAttribute("onClick",'()=>{Hello()}');
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