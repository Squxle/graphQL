const urlAutotification = "https://zone01normandie.org/api/auth/signin";
const urlGraph = "https://zone01normandie.org/api/graphql-engine/v1/graphql";

let infoUser;                                                                                                                                       
let allTransactInfo;

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("submitButton").addEventListener("click", function() {
        const passwordDIV = document.getElementById("password");
        const usernameDIV = document.getElementById("username");
        credentials.password = passwordDIV.value;
        credentials.username = usernameDIV.value;
        fetchZone01();
    });
});


const credentials = {
    username: '',
    password: '',
};

let jwtToken;

function fetchZone01(){
    let login = async function () {
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + btoa(credentials.username + ':' + credentials.password));
        try {
          const response = await fetch(urlAutotification, {
            method: 'POST',
            headers: headers
          });
          const token = await response.json();
          if (response.ok) {
            console.log("ok" ,response)
            jwtToken = token;
        
            console.log(jwtToken)
            fetchUserData();
          } else {
            console.log("no", token.message);
            afficherError()
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };
    login();
}

let timeout;
function afficherError(){
    clearTimeout(timeout);
    const error = document.getElementById("errorMessage");
    error.textContent="Error bad password or username"
    timeout = setTimeout(()=>{
        error.textContent=""
    },2000);
}

async function fetchUserData() {

    fetch(urlGraph, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify({
            query: `
        query {
            user {
                id
                login
                attrs
                totalUp
                totalDown
                transactions ( where: {eventId: {_eq: 148}}, order_by: {createdAt:asc}){
                amount
                type
                createdAt
                }
            }
            transaction{
                id
                type
                amount 	
                objectId 	
                userId 	
                createdAt 	
                path
            }
        }`
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.data.user[0]);
        infoUser = data.data.user[0];
        allTransactInfo = data.data.transaction;
        createProfilPageUser();
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
    });

}

async function createProfilPageUser(){
    if (infoUser){
        const contentPage = document.getElementById("allContent");
        contentPage.innerHTML = "";
        await bonjourProfil()

        profilUser(contentPage)
        generateGraphLinear();
        generateGraphBar(); 
        console.log(transactSkill())
        createRadarChart(transactSkill());

    }
}

async function bonjourProfil() {
    const nomUser = infoUser.attrs.firstName;
    const bonjour = document.getElementById("titrePage");

    const animateBonjour = (texte, delay) => {
        setTimeout(() => {
            bonjour.textContent = texte;
        }, delay);
    };

    animateBonjour("Bonjour .", 0);
    animateBonjour("Bonjour ..", 400);
    animateBonjour("Bonjour ...", 800);
    animateBonjour(`Bonjour ${nomUser}`, 1200);

    const boutonRefresh = document.createElement("button");
    boutonRefresh.textContent = "Exit";

    boutonRefresh.addEventListener("click", function() {
        window.location.reload();
    });

    document.getElementById("allContent").appendChild(boutonRefresh)
}

function profilUser(contentPage){

    const ligne1 = document.createElement("div");
    ligne1.className = "infoUser";
    ligne1.textContent= `-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-`;


    const infoUserPersonnel = document.createElement("div");
    infoUserPersonnel.className="infoUser";
    infoUserPersonnel.textContent = "Voici vos infos personnelles:";

    const infoUserID = document.createElement("div");
    infoUserID.className="infoUser";
    infoUserID.textContent=`Id: ${infoUser.id}`;

    const infoUserLog = document.createElement("div");
    infoUserLog.className="infoUser";
    infoUserLog.textContent=`Username: ${infoUser.login}`;

    const infoPhone = document.createElement("div");
    infoPhone.className="infoUser";
    infoPhone.textContent=`Téléphone: ${infoUser.attrs.Phone}`;

    const infoUserMail = document.createElement("div");
    infoUserMail.className="infoUser";
    infoUserMail.textContent=`Mail: ${infoUser.attrs.email}`;

    const infoGender = document.createElement("div");
    infoGender.className="infoUser";
    infoGender.textContent=`Ton sexe de naissance: ${infoUser.attrs.gender}`;

    const infoAdressStreet = document.createElement("div");
    infoAdressStreet.className="infoUser";
    infoAdressStreet.textContent=`Tu habites à : ${infoUser.attrs.addressStreet}`;

    const bonneUsage = document.createElement("div");
    bonneUsage.className="infoUser";
    bonneUsage.textContent=`voila ${infoUser.attrs.firstName} ;)`;

    const motivation = document.createElement("div");
    motivation.className="infoUser";
    motivation.textContent=`phrase de motivation: "${infoUser.attrs.attentes}"`;

    const levelUser = document.createElement("div");
    levelUser.className = "infoUser";
    levelUser.textContent= `Level: ${foundLevelUser()}`;

    const ligne = document.createElement("div");
    ligne.className = "infoUser";
    ligne.textContent= `-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-`;

    contentPage.appendChild(ligne1)
    contentPage.appendChild(infoUserPersonnel);
    contentPage.appendChild(infoUserID);
    contentPage.appendChild(infoUserLog);
    contentPage.appendChild(levelUser);
    contentPage.appendChild(infoPhone);
    contentPage.appendChild(infoUserMail);
    contentPage.appendChild(infoGender);
    contentPage.appendChild(infoAdressStreet);
    contentPage.appendChild(motivation);
    contentPage.appendChild(bonneUsage);
    contentPage.appendChild(ligne);
}

function foundLevelUser(){

    let level;

    for (let i = 0; i < infoUser.transactions.length-1; i++){
        if (infoUser.transactions[i].type === "level"){
            level = infoUser.transactions[i].amount
        }
    }

    return level
}


function transactionsEXP(){
    let array = [];
    for(let i = 0; i < infoUser.transactions.length-1; i++){
        if (infoUser.transactions[i].type ==="xp"){
            array.push(Number(infoUser.transactions[i].amount))
        }
    }
    return array
}


function generateGraphLinear() {

    const xpAlltransact = document.createElement("div");
    xpAlltransact.className="graphDiv";

    const xpAmount= document.createElement("div");
    xpAmount.className="infoUser";
    xpAmount.textContent=`Nombres de transactions d'exp recu (projets, piscine, évaluation...) : ${transactionsEXP().length}\n`

    const maxAmount = Math.max(...transactionsEXP());
    const minAmount = Math.min(...transactionsEXP());
    let sommeOfAllValues = transactionsEXP().reduce((acc, curr) => acc + curr, 0);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 1200);
    svg.setAttribute("height", 400);
    svg.style.boxShadow = "0 0 0 3px steelblue";
    
    for (let i = 0; i <= 9; i++) {
        if (i === 0 ){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y);
            text.setAttribute("fill", "white");
            text.textContent = i * 100;
            svg.appendChild(text);
        }else if(i===6){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y);
            text.setAttribute("fill", "white");
            text.textContent = `Nombre d'exp totale : ${sommeOfAllValues}`; 
            svg.appendChild(text);
        }else if(i===7){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y );
            text.setAttribute("fill", "white");
            text.textContent =`Plus faible transaction ---> ${minAmount}`;
            svg.appendChild(text);
        }else if(i===8){
            const sum = transactionsEXP().reduce((acc, curr) => acc + curr, 0);
            const average = sum / transactionsEXP().length;
            const roundedAverage = Math.round(average * 100) / 100;
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y );
            text.setAttribute("fill", "white");
            text.textContent =`Moyenne des transactions ---> ${roundedAverage}`;
            svg.appendChild(text);
        }else if(i === 9){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y );
            text.setAttribute("fill", "white");
            text.textContent =`Plus grosse transaction ---> ${maxAmount}`;
            svg.appendChild(text);
        }
    }

    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");

    let amountValue = 0;

    const points = transactionsEXP().map((value, index) => {
        amountValue = amountValue+value
        const x = index * 20; 
        const y = 400 - (amountValue / sommeOfAllValues) * 400; 
        return `${x},${y}`;
    }).join(" ");

    line.setAttribute("points", points);
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "steelblue");
    line.setAttribute("stroke-width", 2);

    svg.appendChild(line);


    xpAlltransact.appendChild(xpAmount)
    xpAlltransact.appendChild(svg)
    document.getElementById("allContent").appendChild(xpAlltransact);

    const ligne = document.createElement("div");
    ligne.className = "infoUser";
    ligne.textContent= `-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`;
    document.getElementById("allContent").appendChild(ligne);

}

function generateGraphBar() {
    const data = transactPointAudits();
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 600);
    svg.setAttribute("height", 400);
    svg.style.boxShadow = "0 0 0 3px steelblue";

    const xpAlltransact = document.createElement("div");
    xpAlltransact.className="graphDiv";

    const auditAllTarnsact = document.createElement("div");
    auditAllTarnsact.className="infoUser";
    auditAllTarnsact.textContent=`Nombres d'audit passer : ${data.length}\n`;

    xpAlltransact.appendChild(auditAllTarnsact);
    xpAlltransact.appendChild(svg);
    const chartWidth = 600;
    const chartHeight = 400;
    const barWidth = chartWidth / data.length;

    const maxValue = Math.max(...data.map(item => Math.abs(item.amount)));

    const dataBig = data.filter((value)=> value.amount=== maxValue)

    for (let i = 0; i <= 9; i++) {
        if (i === 9 ){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y);
            text.setAttribute("fill", "white");
            text.textContent = `Audit le plus gros ---> ${dataBig[0].path} ,`;
            svg.appendChild(text);
        }else if (i===8){
            const y = 400 - i * 40;
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", 0);
            text.setAttribute("y", y);
            text.setAttribute("fill", "white");
            text.textContent = `avec plus de ${dataBig[0].amount} points d'exp`;
            svg.appendChild(text);
        }
    }

    data.forEach((value, index) => {
        let barHeight = (Math.abs(value.amount) / maxValue) * chartHeight;
        if (value.type === "down") {
            barHeight *= -1;
        }
        const x = index * barWidth;
        const y = chartHeight - Math.max(0, Math.abs(barHeight)); 
    
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", barWidth);
        rect.setAttribute("height", Math.abs(barHeight));
        rect.setAttribute("fill", value.type === "up" ? "green" : "red");
    
        svg.appendChild(rect);
    });    

    document.getElementById("allContent").appendChild(xpAlltransact)

    const ligne = document.createElement("div");
    ligne.className = "infoUser";
    ligne.textContent= `-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`;
    document.getElementById("allContent").appendChild(ligne);
}

function transactPointAudits(){
    let array = [];
    for(let i = 0; i < allTransactInfo.length-1; i++){
        let transact = allTransactInfo[i].type;
        if (transact === "up" || transact === "down"){
            array.push(allTransactInfo[i])
        }
    }
    return array
}

function transactSkill(){
    let obj1 ={
        amount: 0,
        createdAt: "",
        id: 0,
        objectId: 0,
        path: "",
        type: "",
        userId: 0
    }
    let obj = {
        go : obj1,
        js : obj1,
        algo : obj1,
        front : obj1,
        back : obj1,
        prog : obj1
    }
    for(let i = 0; i < allTransactInfo.length-1; i++){
        let transact = allTransactInfo[i].type;
        switch (transact){
            case "skill_prog":
                if (allTransactInfo[i].amount > obj.prog.amount){
                    obj.prog = allTransactInfo[i];
                }
                break
            
            case "skill_go":
                if (allTransactInfo[i].amount > obj.go.amount){
                    obj.go = allTransactInfo[i];
                }
                break

            case "skill_js":
                if (allTransactInfo[i].amount > obj.js.amount){
                    obj.js = allTransactInfo[i];
                }
                break

            case "skill_front-end":
                if (allTransactInfo[i].amount > obj.front.amount){
                    obj.front = allTransactInfo[i];
                }
                break

            case "skill_back-end":
                if (allTransactInfo[i].amount > obj.back.amount){
                    obj.back = allTransactInfo[i];
                }
                break

            case "skill_algo":
                if (allTransactInfo[i].amount > obj.algo.amount){
                    obj.algo = allTransactInfo[i];
                }
                break
            default:
                break
        }
    }
    let array = [];
    array.push(obj.algo);
    array.push(obj.back);
    array.push(obj.front);
    array.push(obj.go);
    array.push(obj.js);
    array.push(obj.prog);
    return array
}

function createRadarChart(data) {

    const skillInfo = document.createElement("div");
    skillInfo.className = "graphDiv";
    skillInfo.textContent= `Vos skills : `;
    document.getElementById("allContent").appendChild(skillInfo);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 600);
    svg.setAttribute("height", 400);

    const width = 600;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    data.forEach((value, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "rgba(255, 255, 255, 0.5)");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y);
        label.setAttribute("fill", "white");
        label.setAttribute("font-size", "14px");
        label.setAttribute("text-anchor", "middle"); 
        label.setAttribute("alignment-baseline", "middle");
        label.textContent = `${data[index].type} : ${data[index].amount}`;
        svg.appendChild(label);
    });

    const polyPoints = data.map((value, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = centerX + (radius * value.amount) / 100 * Math.cos(angle);
        const y = centerY + (radius * value.amount) / 100 * Math.sin(angle);
        return `${x},${y}`;
    });
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", polyPoints.join(" "));
    polygon.setAttribute("fill", "rgba(255, 0, 0, 0.5)");
    svg.appendChild(polygon);

    document.getElementById("allContent").appendChild(svg);

    const ligne = document.createElement("div");
    ligne.className = "infoUser";
    ligne.textContent= `-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_\n-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_--_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`;
    document.getElementById("allContent").appendChild(ligne);
}