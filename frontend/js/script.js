let inputUserSearch = null;

let allUsers = [];
let maleCount = 0;
let femaleCount = 0;
let ageSum = 0;
let average = 0;

let numberFormat = null;

window.addEventListener('load', () =>{
  preventFormSubmit();
  let btnSearch = document.querySelector('#btn-search');
  btnSearch.addEventListener('click', render);

  inputUserSearch = document.querySelector('#input-user-search');
  inputUserSearch.addEventListener('keyup', render);  

});

function preventFormSubmit(){
  function handleFormSubmit(event){
    event.preventDefault();    
  }
  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

async function fetchUsers() {
  const res = await fetch('http:/localhost:3001/users');
  json = await res.json();
  allUsers = json.map(user => {
    const { gender, name, dob, picture } = user;

    return {
      gender,
      name: name.first + ' ' + name.last,
      age: dob.age,
      picture: picture.thumbnail
    };
  });
}

function render(event){  
  fetchUsers();  
  if((event.key === 'Enter') || (event.type === 'click')){
    renderUserList();
  }  
}

function renderUserList(){    
  const spanUserCount = document.querySelector('#count-users');
  const divUserList = document.querySelector('#user-result');
  const divUserData = document.querySelector('#user-statistics-result');
  let filteredUsers = [];
  let param = inputUserSearch.value;
  let usersHTML = '<div>';
  
  if(param.trim().length > 0){
    filteredUsers = allUsers.filter(user =>{
      return user.name.toLowerCase().includes(param.toLowerCase());
    });
  }
  divUserList.innerHTML = '';
  divUserData.innerHTML = '';
  spanUserCount.innerHTML = 0;  
  if(filteredUsers.length > 0) {
    filteredUsers.sort((a,b) => {
      return a.name.localeCompare(b.name);
    });

    filteredUsers.forEach(user => {
      const { name, age, picture } = user;
      const userHTML = `
        <div class="user">
          <div>
           <img src="${picture}" alt="Foto usuário">
          </div>
          <div class="valign-wrapper">
           ${name} , ${age} anos
          </div>
        </div>
      `;
      usersHTML += userHTML;
    });
    usersHTML += '</div>';  
    divUserList.innerHTML = usersHTML;
    
    let countUsers = filteredUsers.length;
    spanUserCount.innerHTML = countUsers;

    renderStatisticsTotalMale(filteredUsers, divUserData);
    renderStatisticsTotalFemale(filteredUsers, divUserData);
    renderStatisticsTotalAge(filteredUsers, divUserData);
  }  
} 

function renderStatisticsTotalMale(arrayUsers, divContainer){
  let maleUsers = arrayUsers.filter(user =>{
    return user.gender == 'male';
  });
  const totalMale = maleUsers.length;

  let totalMaleHTML = `
    <div>Sexo masculino: ${totalMale}</div>  
  `;

  console.log(totalMale);

  divContainer.innerHTML += totalMaleHTML;

}
function renderStatisticsTotalFemale(arrayUsers, divContainer){
  let femaleUsers = arrayUsers.filter(user =>{
    return user.gender == 'female';
  });
  const totalFemale = femaleUsers.length;

  let totalFemaleHTML = `
    <div>Sexo feminino: ${totalFemale}</div>  
  `;

  divContainer.innerHTML += totalFemaleHTML;
}

function renderStatisticsTotalAge(arrayUsers, divContainer){
  const totalAge = arrayUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  let averageAge = renderStatisticsAverageAge(arrayUsers.length, totalAge);
  averageAge = formatNumber(averageAge);

  let totalAgeHTML = `
    <div>Soma das idades: ${totalAge}</div> 
    <div>Média das idades: ${averageAge}</div> 
  `;

  divContainer.innerHTML += totalAgeHTML;
}

function renderStatisticsAverageAge(totalUsers, totalAge){
  let average = 0;
  if(totalAge > 0 && totalUsers > 0 && totalAge > totalUsers) {
    average = totalAge / totalUsers;    
  }
  return average;
}

function formatNumber(number){
  const numberFormat = Intl.NumberFormat('pt-BR', { maximumSignificantDigits: 4 });
  if(number){
    return numberFormat.format(number);
  }  
}

  

