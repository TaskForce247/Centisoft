

var storage = window.localStorage;
$(document).ready(function () {

   
  $("#postCustomerBtn").click((event)=>{
    event.preventDefault();
  
      $.ajax({
          headers: {
            "centisoft_token":"VerySecretToken1"
          },
          url: `http://localhost:57422/api/customers/0`,
          method:'POST',
          data:$("#form").serialize(),
          'success':()=>{window.location.replace("customers.html")},
          'error':()=>{alert("shit")}
      })
  })
  

    $("#btnGetDevelopers").click(function () {
        getDevelopers();
    })
    $("#btnGetCustomers").click(function () {
        getCustomers();
    })
    $("#btnSubmit").click(function () {
        let name = $("#txtName").val();
        let email = $("#txtEmail").val();
        let developer = { "Name": name, "Email": email, "Task": null }
        postDeveloper(developer)
    });

   

    $("#developerButton").click(function () {
        window.location.href = 'developer.html'
    })


function redirect(id)
{
  window.localStorage.setItem('id', id);
window.location.replace('projects.html')}


function loadDeveloperTable(data) {
    var table = document.getElementById("developerTable")
    table.innerHTML = "<tr><th>Id</th><th>Name</th><th>Email</th><th>Task</th></tr>";
    for (var i = 0; i < data.length; i++) {
        table.innerHTML += "<tr>" +
            "<td class='id'>" + data[i].Id + "</td>" +
            "<td class='editableCell editName' contenteditable='false'>" + data[i].Name + "</td>" +
            "<td class='editableCell editEmail' contenteditable='false'>" + data[i].Email + "</td>" +
            "<td class=tableTask>" + data[i].Tasks[0] + "</td>" +
            "<td><button class='btn delete' style='font-size:10px;'>Delete</button></td>" +
            "<td><button class='btn update' style='font-size:10px;'>Edit</button></td>"
        "</tr>"
    }

    $('#developerTable tr').find('.delete').click(function () {
        var id = $(this).parent().parent().find('.id').text();
        deleteDeveloper(id);
    });

    $('#developerTable tr').find('.update').click(function () {
        upDateButtonHandler($(this));
    });

}

function postDeveloper(newDeveloper) {
    $.ajax({
		 headers: {
            "centisoft_token":"VerySecretToken1"
          },
        url: 'http://localhost:57422/api/developers',
        dataType: 'json',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newDeveloper),
        //headers: { 'Authorization': $.cookie("token") },
        success: function (data) {
            getDevelopers();
            //Reset textfields
            $("#txtName").val("");
            $("#txtEmail").val("");
        },
        error: function () {
            alert("Couldn't post new trtrloper at the moment. Will try again after next refresh")
            var localstorage = window.localStorage;
            if (localstorage.getItem("pendingPosts") === null) {
                let posts = [];
                posts.push(newDeveloper);
                localstorage.setItem("pendingPosts", JSON.stringify(posts));
            }
            else {
                let storedPosts = JSON.parse(localstorage.getItem("pendingPosts"));
                storedPosts.push(newDeveloper);
                localstorage.setItem("pendingPosts", JSON.stringify(storedPosts));
            }

        }
    });
}

function updateDeveloper(editedDeveloper, id) {
    $.ajax({
		 headers: {
            "centisoft_token":"VerySecretToken1"
          },
        url: 'http://localhost:57422/api/developers',
        url: 'http://localhost:57422/api/developers/' + id,
        dataType: 'json',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(editedDeveloper),
      //  headers: { 'Authorization': $.cookie("token") },
        success: function (data) {
            getDevelopers();
        },
        error: function (jqXhr, textStatus, errorThrown) {
            alert("Something went wrong")
        }
    });

}


function deleteDeveloper(id) {
    $.ajax({
		 headers: {
            "centisoft_token":"VerySecretToken1"
          },
        url: 'http://localhost:57422/api/developers',
        url: 'http://localhost:57422/api/developers/' + id,
        method: 'DELETE',
        contenttype: "application/json; charset=utf-8",
      //  headers: { 'Authorization': $.cookie("token") },
        success: function (result) {
            getDevelopers();

        },
        error: function (request, msg, error) {
            alert("Shit. didnt work. Try again");
        }
    });
}

function getDevelopers() {
     api("developers").then(res=>{
    res.forEach(item=>{
      var a=`<tr><td>${item.Name}</td><td>${item.Email}</td></tr>`;
      document.getElementById("developerTable").innerHTML+=a;
    })
  }).catch(err=>{console.log(err);})
}
function getProjects(id){
  var customerName;
  api(`customers/${window.localStorage.getItem('id')}/projects`).then(res=>{console.log(res);
    api(`customers/${window.localStorage.getItem('id')}`).then(cust=>{
      customerName=cust.Name;
      document.getElementById('title').innerHTML += customerName;
      res.forEach(item=>{
        console.log(item);
        var row = `<tr><td>${customerName}</td><td>${item.Name}</td><td>${item.DueDate}</td></tr>`;
        document.getElementById('tablebody').innerHTML+=row;
      })
    })
  }).catch(err=>{console.log(err);})
}
function getCustomers(){
  api("customers").then(res=>{console.log(res);
    res.forEach(item=>{
      console.log(item.Address2==null);
      var address= item.Address + " " + (item.Address2==null?"":item.Address2);
      var row = `<tr><td>${item.Name}</td><td>${address}</td><td>${item.City}</td><td>${item.Country}</td><td>${item.Email}</td><td>${item.Phone}</td><td>${item.Zip}</td><td><button onclick="redirect(${item.Id})">Projects</button></td></tr>`;
      document.getElementById('cusTable').innerHTML+=row;
    })
  }).catch(err=>{console.log(err);})
}



function api(endpoint){
		return new Promise((resolve,reject)=>{
		var conf={
      beforeSend:(request)=>{request.setRequestHeader("centisoft_token", 'VerySecretToken1');},
      dataType: "json",
      url: `http://localhost:57422/api/${endpoint}`,
      success: (data)=>{resolve(data);},
      error:(data)=>{reject(data);}
    };
    $.ajax(conf);
  })
}




