const buttonSubmit = document.getElementById("send-button-public");
const messageContainer = document.getElementById('messages-container-public');
const formPublic = document.getElementById("message-form-public");
const formPrivee = document.getElementById("message-form-privé")
const userInputPrive = document.getElementById("user-input-privé");
const userInput = document.getElementById("user-input-public");
const modalForm = document.getElementById("username-form");
const userNameInput = document.getElementById("username-input");
const UsernamePrompt = document.getElementById("username-prompt");
const containerPrivee = document.getElementById("chat-container-privé");
const usersListContainer = document.getElementById("users-list-container");
const typingIndactor = document.getElementById("typing-indicator");
let userName = "";
const socket = io();

function createNewSocketConnectionAsync() {
    return new Promise((resolve) => {
        const newSocket = io('http://localhost:3000'); 
        
        newSocket.on('connect', () => {
            // L'ID est disponible ici, on résout la Promise avec cet ID
            resolve(newSocket.id);
        })
    });
}


async function getSomeUsersId(){
    const id_Users = [];
    try{
        for(i = 0 ; i<=5 ; i++){
        const id_socket = await  createNewSocketConnectionAsync();
        id_Users.push(id_socket);
        }
        return id_Users;
    }catch (error){
        console.log(error.message)
    }
}


usersListContainer.addEventListener('click', (e) => {
    const clickedElement = e.target;

    if (clickedElement.classList.contains('user-item') || clickedElement.tagName === 'P') {
        
        // Récupérer le nom d'utilisateur cliqué
        const selectedUserName = clickedElement.textContent.trim();
        document.getElementById('chat-container-privé').classList.remove('hidden');
        console.log(`Utilisateur sélectionné : ${selectedUserName}`);

    }
});
modalForm.addEventListener("submit" , (e) => {
        e.preventDefault();     
        if(userNameInput.value !== ""){
            const username = userNameInput.value;
            socket.emit('set_username', (username));
            UsernamePrompt.style.display = "none";
            userName = userNameInput.value;
        }
    })


    function getId(){
        return socket.id;
    }
    function getUsername(){
        return userName;
    }

    function userConnected(msg){
        const messagesContainer = document.getElementById('messages-container-public');
        const p = document.createElement('p');
        p.textContent = msg;
        messagesContainer.appendChild(p);
        
    }

    function userDisconnected(msg){
        const messagesContainer = document.getElementById('messages-container-public');
        const p = document.createElement('p');
        p.textContent = msg;
        messagesContainer.appendChild(p);
    }

    


socket.on('connect', () => {
        const id = socket.id;
        console.log(`✅ Connecté au serveur. Socket ID: ${id}`);
        // Vous pouvez ajouter ici la logique pour mettre à jour l'interface utilisateur
    });





    socket.on('disconnect', (reason) => {
        console.log(`❌ Déconnecté du serveur.`);
        console.log(`Raison de la déconnexion: ${reason}`);
        // Affichera une raison comme "transport close" ou "ping timeout"
    });

    socket.on('chat_message', msg  => {

        console.log(msg);
    })

    socket.on("connexion" , msg =>{
        userConnected(msg);
    });

    socket.on("deconnexion" , msg => {
        console.log(msg);
        userDisconnected(msg);
    })


socket.on('users_list_update', async (users) => {
const listContainer = document.getElementById('users-list-container');
const id_input = document.getElementById('recipient-id-field');
const flag = false; 

 listContainer.innerHTML ='';
    users.forEach(user => {
        
        if (user.name !== getUsername()) {
            // N'affiche pas son propre nom
            const item = document.createElement('p');
            item.textContent = user.name;
            id_input.value = user.id;
            item.classList.add('user-item');
            listContainer.appendChild(item);
        }
    });
});



function appendMessageReceivedPublic(userMessageObject) {
    const container = document.getElementById('messages-container-public');
    
    const messageElement = document.createElement('div');
    const userNameElement = document.createElement('p');

    // Affichage dans le chat PUBLIC, marqué comme REÇU
    messageElement.className = 'message received';
    userNameElement.className = 'username-label received';
    
    messageElement.textContent = userMessageObject.message;
    userNameElement.textContent = `— ${userMessageObject.user}`;
    
    messageElement.appendChild(userNameElement);
    container.appendChild(messageElement);

    container.scrollTop = container.scrollHeight;
}


function appendMessageSentPrivee(userMessageObject) {
    const container = document.getElementById('messages-container-privé');
    
    const messageElement = document.createElement('div');
    const userNameElement = document.createElement('p');

    // Affichage dans le chat PRIVÉ, marqué comme ENVOYÉ
    messageElement.className = 'message sent';
    userNameElement.className = 'username-label sent';
    
    messageElement.textContent = userMessageObject.message;
    // Afficher le destinataire
    
    messageElement.appendChild(userNameElement);
    container.appendChild(messageElement);

    container.scrollTop = container.scrollHeight;
}



formPublic.addEventListener("submit" , (e) =>{

    e.preventDefault();
    if(userInput.value !== ""){

    //userMessage = userInput.value;
    const userMessageObject = {
        user : `${getUsername()}`,
        message : userInput.value    
    };
    
    socket.emit('chat_message', userMessageObject);

    userInput.value = "";
    }
    })

socket.on('chat_message', msg => {
    appendMessageReceivedPublic(msg); 
});

formPrivee.addEventListener("submit" , (e) =>{

    e.preventDefault();
    const formElement = e.target;
    if(userInputPrive.value !== ""){
    const recipientIdField = formElement.querySelector("#recipient-id-field");
    
   // console.log(e.target.getAttribute('data-socket-id'));
    const recipientSocketId = recipientIdField.value
        console.log(recipientSocketId);
        //userMessage = userInput.value;
    const userMessageObject = {
        id : `${recipientSocketId}`,
        user : `${getUsername()}`,
        message : userInputPrive.value    
    };
    socket.emit('private_message', userMessageObject);
    appendMessageSentPrivee(userMessageObject);
    userInputPrive.value = "";
    }
    })

socket.on('private_message_received' , userMessageObject => {
    document.getElementById('chat-container-privé').classList.remove('hidden');
    appendMessageReceivedPrivee(userMessageObject);
    //appendMessageSentPrivee(userMessageObject);
});


function appendMessageReceivedPrivee(userMessageObject) {
    const container = document.getElementById('messages-container-privé');
    
    // Créer les éléments
    const messageElement = document.createElement('div');
    const userNameElement = document.createElement('p');

    // Assigner les classes (received = que VOUS avez reçu)
    messageElement.className = 'message received';
    userNameElement.className = 'username-label received'; 

    // Contenu : Le message reçu et le nom de l'expéditeur
    messageElement.textContent = userMessageObject.message;
    
    // Assemblage et ajout
    messageElement.appendChild(userNameElement);
    container.appendChild(messageElement);

    // Défilement
    container.scrollTop = container.scrollHeight;
}

userInput.addEventListener('input', e => {
    const userName = getUsername();
    socket.emit("est_entrain_ecrire" , userName) 
});


//Permet de vider la div qui contient le TypingIndicator 
//lorsqu'il recoit le flux "typing_stop"
//Cepedant faut trouver comment pouvoir emmettre en premier lieu le : 
//socket.on('a_arreter_ecrire', () => {....}
//coté client !!

socket.on('typing_stop' , () => {
    typingIndactor.innerHTML = "";
})

socket.on('typing_start',  userName => {

    //Condition qui permet d'empecher le dédoublement de la balise p à chaque input du user
    if(!typingIndactor.querySelector('p')){
        const p = document.createElement('p')
        p.textContent = `${userName} est entrain d'écrire ....`;
        typingIndactor.appendChild(p);
    }
});