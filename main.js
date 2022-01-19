//Niklas van Herbert - niva1202
// Datateknik
// Webbprogrammering, Laboration 2
"use strict";

var baseURL = "http://api.sr.se/api/v2/";


// Wait for DOM to load
document.addEventListener("DOMContentLoaded", function(){ 
    var xmlhttp = new XMLHttpRequest();

    // LÃ¤ser in SR's kaneler i en lista som lÃ¤ggs i elementet mainnavlist
    xmlhttp.onreadystatechange = function() {
    
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                var json = JSON.parse( xmlhttp.responseText );
                //ladda in endast 10 kanaler.
                for(var i=0; i < 10; i++){
                   document.getElementById("mainnavlist").innerHTML += "<li id='"+json.channels[i].id+"'>" +
                   "<img src='" + json.channels[i].image +"' width='20' height='20'>"+ "  " + json.channels[i].name+"</li>";    
                   document.getElementById("searchProgram").innerHTML += "<option value='"+json.channels[i].id+"'>"+json.channels[i].name+"</option>"; 
       
                }       
            };
    }
    xmlhttp.open("GET", baseURL + "channels?size=100&format=json", true);
    xmlhttp.send();
    //
    // Create eventlistener for click on search program-----------------------------------------
    
    // Evenlistener fÃ¶r sÃ¶kknappen
    document.getElementById('searchbutton').addEventListener("click", function(){
        //plockar ut valt programs vÃ¤rde ur listan brevid sÃ¶kknappen.
        var channels = document.getElementById("searchProgram");
        var channelid = channels.options[channels.selectedIndex].value;
        var xmlhttpTable = new XMLHttpRequest();
        xmlhttpTable.onreadystatechange = function() {
            if (xmlhttpTable.readyState == XMLHttpRequest.DONE ) {
                //-------------------------------------------
                    var json = JSON.parse(xmlhttpTable.responseText);
                    var scheduleArray = json.schedule;
                
                    document.getElementById("info").innerHTML = "";
                
                    for (let i = 0; i < scheduleArray.length; i++) {
                        //tar bort /Date() ur den returnerade textstrÃ¤ngen frÃ¥n starttimeutc, detta fÃ¶r att kunna jobba med vÃ¤rdena som returneras i ().
                         var tid = scheduleArray[i].starttimeutc;
                         tid = tid.replace('/Date(','');
                         tid = tid.replace(')/','');
                         
                        document.getElementById("info").innerHTML += "<h3>" + scheduleArray[i].title + "</h3>"
                            + "<p><b>" + scheduleArray[i].description + "</b></p>"
                            + "<p>" + new Date(parseInt(tid)) + "</p>" + "<hr>";
                    }
                
                    //----------------------------------------------
            }      
        }
        // init. ny fÃ¶rfrÃ¥gan samt skicka fÃ¶rfrÃ¥gan till server
        xmlhttpTable.open("GET", baseURL + "scheduledepisodes?channelid=" + channelid + "&format=json", true);
        xmlhttpTable.send();
    }); 
    
  
    // Eventlistener fÃ¶r kanalerna i mainnavlist. Vid klick sÃ¥..
    document.getElementById('mainnavlist').addEventListener("click", function(e){
        var channelid = e.target.id;
        // Spela upp aktuellt radioprogramm frÃ¥n vald kanal. Channelid= det man klickat pÃ¥
        var audio = new Audio("http://sverigesradio.se/topsy/direkt/srapi/" + channelid + ".mp3");
        audio.play().then(() => {});

        document.getElementById('searchProgram').value = channelid;
        // om man trycker pÃ¥ nÃ¥gon annan kanal efter man redan valt en sÃ¥: Pausa aktuell kanal.
        document.getElementById('mainnavlist').addEventListener("click", function() {audio.pause()});
//-----------------------------------------------------------------------------------------------------
        var xmlhttp = new XMLHttpRequest();
        // Visa aktuell kanals namn och beskrivning
        xmlhttp.onreadystatechange = function() {
        
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                    var json = JSON.parse( xmlhttp.responseText );
                        document.getElementById("info").innerHTML = "<h3>" + json.channel.name + "</h3>"
                            + "<p><b>" + json.channel.tagline + "</b></p>" +
                            "<hr>";
                    }         
        };
       
//----------------------------------------------------------
     var xmlhttpNext = new XMLHttpRequest();
        xmlhttpNext.onreadystatechange = function() {
            // Visa lÃ¥tinformation fÃ¶r aktuell kanal. Artist, titel, vilken nÃ¤sta sÃ¥ng Ã¤r och vilken fÃ¶regÃ¥ende sÃ¥n var.
            if (xmlhttpNext.readyState == XMLHttpRequest.DONE ) {
                    var json = JSON.parse( xmlhttpNext.responseText );
                    document.getElementById("info").innerHTML += "Next song : " + json.playlist.nextsong.artist + " - " +
                     json.playlist.nextsong.title + "</br>" + "Previous song: " + json.playlist.previoussong.artist +
                      " - " + json.playlist.previoussong.title;
                    }       
        }
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

        // init. ny fÃ¶rfrÃ¥gan samt skicka fÃ¶rfrÃ¥gan till server
        xmlhttp.open("GET", baseURL +  "channels/" + channelid + "?&format=json", true);
        xmlhttp.send();
        xmlhttpNext.open("GET", baseURL + "playlists/rightnow?channelid=" + channelid + "&startdatetime=" + date + "?&format=json", true);
        xmlhttpNext.send();
//-------------------------------------------------------------------------------------------------
    
    });  
    
       
}); //--------------------DOM DOM DOM----------------------------------------------------//
