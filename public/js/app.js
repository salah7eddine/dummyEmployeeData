const url = 'http://dummy.restapiexample.com/api/v1/employees';



var dataUsers;
var cloneDataUsers;
var size = 20;
var currentPage = 0;
var totalPages;
var pages = [];


// ----------------- Async / Await / Fetch ----------------------

// Call Data From the API
async function fetchUsers() {
    await fetch(url)
        .then(res => res.json())
        .then(data => {
            dataUsers = chunkArray(data, size);
            totalPages = dataUsers.length;

            pages = new Array(totalPages);

            cloneDataUser(cloneDataUsers);

            showUsers(dataUsers[currentPage]);
            paginationOfUsers();

        })
        .catch(err => console.log(err));
}



// Call Data Users, execute in background 
fetchUsers();


// function that permet to show the Data into the Browser
function showUsers(infoUsers) {
    let output = '';
    infoUsers.forEach((user, index) => {
        output += `
            <tr id=${user.id}>
              <th scope="row">${user.id}</th>
              <td>${user.employee_name}</td>
              <td>${user.employee_salary}</td>
              <td>${user.employee_age}</td>
              <td id = "getId" type="button" class = "" onclick = onGet(${user.id})>Get</td>
              <td id = "edit" type="button" class = "" onclick = onEdit(${user.id})>Edit</td>
              <td id = "delete" type="button" class = "btn-danger" onclick = onDelete(${user.id})>Delete</td>
            </tr>
        `;
    });
    document.getElementById('users').innerHTML = output;
}

function onGet(id) {
    getUser(id);
}

function onEdit(id) {
    console.log(id);

}

function onDelete(id) {
    let conf = confirm("Etes vous sùre ?");
    if (conf) {
        deleteUser(id);

    }
}


function paginationOfUsers() {
    let p = '';

    for (let i = 0; i < pages.length; i++) {
        p += `
            <li>
                <a onclick="onPageUsers(${i})">${i}</a>
            </li>
        `;
    }


    document.getElementById('pages').innerHTML = p;
};


const onPageUsers = i => {
    currentPage = i;
    fetchUsers();
}


// function that Order the data in their name
function funSortByName(a, b) {
    return (a.employee_name.toLowerCase() > b.employee_name.toLowerCase()) ? 1 : -1;
}

// function that Clone in Object that we want
const cloneDataUser = (x) => {
    cloneDataUsers = Object.assign({}, x);
}


// When we click the first button 
function GetUser() {
    showUsers(dataUsers[currentPage]);
};

// method Clone, sort the data and show them in the Browser 
const GetUserOrderByName = () => {
    cloneDataUsers = Object.keys(dataUsers[currentPage]).map(i => dataUsers[i]);
    cloneDataUsers[currentPage].sort(funSortByName);

    showUsers(cloneDataUsers[currentPage]);
}


const GetUserOrderByAge = () => {

    cloneDataUsers = Object.keys(dataUsers[currentPage]).map(i => dataUsers[i]);

    cloneDataUsers[currentPage].sort((a, b) => a.employee_age - b.employee_age);
    showUsers(cloneDataUsers[currentPage]);
}

const GetUserOrderBySalary = () => {
    cloneDataUsers = Object.keys(dataUsers[currentPage]).map(i => dataUsers[i]);

    cloneDataUsers[currentPage].sort((a, b) => a.employee_salary - b.employee_salary);
    showUsers(cloneDataUsers[currentPage]);
}

// method Get Array to Array, have fun to use this method
function chunkArray(arr, len) {

    // Init chunked arr
    const chunkedArr = [];

    // Loop through arr 
    arr.forEach(val => {
        // Get Last element
        const last = chunkedArr[chunkedArr.length - 1];

        //Check if last and if last length is equal to the chunk len
        if (!last || last.length === len) {
            chunkedArr.push([val]);
        } else {
            last.push(val);
        }
    });
    return chunkedArr;
}

// Get User
function getUser(id) {
    fetch('http://dummy.restapiexample.com/api/v1/employee/' + id).then(resp => resp.json()).then(data => console.log(data));
}

// Delete User
function deleteUser(id) {
    fetch('http://dummy.restapiexample.com/api/v1/delete/' + id, {
        method: 'DELETE'
    }).then(response => response.json()).then(data => {
        alert(`${data.success['text']}`)

    }).catch(err => console.log(err));
}

// Create User
function createUser(user) {
    fetch('http://dummy.restapiexample.com/api/v1/create/', {
        credentials: 'same-origin',
        method: 'POST',
        body: JSON.stringify(user),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(err => console.log(err));
}


// page Add User

const myForm = document.querySelector('#my-form');
const nameInput = document.querySelector('#name');
const ageInput = document.querySelector('#age');
const salaryInput = document.querySelector('#salary');
const msg = document.querySelector('.msg');




function onSumbit(e) {
    e.preventDefault();

    if (nameInput.value === '' || salaryInput.value === '' || ageInput.value === '') {
        msg.classList.add('error');
        msg.innerHTML = 'Please enter all fields';

        setTimeout(() => msg.remove(), 3000);
    } else {
        const userForm = {
            "employee_name": nameInput.value,
            "employee_age": Number(ageInput.value),
            "employee_salary": Number(salaryInput.value),
        }
        createUser(userForm);
    }
}
myForm.addEventListener('submit', onSumbit);