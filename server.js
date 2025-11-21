//require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const http = require("http");
const {Server} = require("socket.io");
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.json()); 

//On crée le serveur HTTP dédié à socket.io
const server = http.createServer(app); 
const io = new Server(server);

const userConnected = [];

server.listen(PORT , () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accéder à l'URL  : http://localhost:${PORT}`);
})

app.get("/" , async (req , res) => {
res.status(200).sendFile(path.join(__dirname , "Public" , "index.html"));


});



io.on("connection", async  (socket) => {
    const connexionUser = "Un nouveau utilisateur viens de se connecter";
    const deconnexionUser = "Un utilisateur s'est déconnecté ! ";
 
    console.log("Un utilisateur s'est connecté.");
    //

    socket.on('set_username', (username) => {

        const newUser = {
        name: username,
        id: socket.id,
        status: 'online'
    };
       
        userConnected.push(newUser);
        // Maintien de la liste Nom -> ID
        
        // 🚨 Mettre à jour la liste des utilisateurs pour tous les clients
        io.emit('users_list_update', userConnected);
    });

    socket.on('private_message', (data) => {
        //const recipientSocketId = connectedUsers[data.id];
        
        if (data.id) {
            // Envoyer le message AU DESTINATAIRE (utilisation de io.to)
            io.to(data.id).emit('private_message_received', data);
            
        } else {
            // Gérer l'erreur si l'utilisateur n'est plus connecté
            socket.emit('system_message', `Erreur : Utilisateur ${data.id} introuvable.`);
        }
    });

socket.on('est_entrain_ecrire', (username) => {
    socket.broadcast.emit('typing_start', username);
});
socket.on('a_arreter_ecrire', () => {
    socket.broadcast.emit('typing_stop');
});

    socket.on("chat_message" , (userMessageObject) => {
        console.log(typeof io);
    
        io.emit("chat_message" ,  userMessageObject)
    });

    io.emit("connexion" , connexionUser );
    
    socket.on("disconnect", () => {
        console.log(socket.id);
        console.log("Un utilisateur s'est déconnecté");
        io.emit("deconnexion" , deconnexionUser);
        
    });
    
});


 