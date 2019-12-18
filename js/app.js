  // Configuracion inicial
  var app = new Framework7({
    root: '#app',
    name: 'My App',
    id: 'com.myapp.test',
    panel: {
      swipe: 'left',
    },
  });

  var mainView = app.views.create('.view-main');



  // BOTONES
  var boton = document.getElementById("mostrarPeliculas");
  boton.onclick = function(){
    traerPeliculas();
  }


  // SERVICIOS
  function traerPeliculas(){
    app.request.get('https://prod-61.westus.logic.azure.com/workflows/984d35048e064b61a0bf18ded384b6cf/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6ZWKl4A16kST4vmDiWuEc94XI5CckbUH5gWqG-0gkAw', function (data) {
      // console.log(data);
      
      mostrarPeliculas(data);   
      
      notificarRecibo(data); 
    });  
  }

  
  // FUNCION QUE MUESTRA PELICULAS ORDENADAS POR RATING
  function mostrarPeliculas(data){
    
    let datos = JSON.parse(data);
  
    datos.response.sort(function(a,b){
      return(b.rating - a.rating)
    })
      
    let info = document.querySelector('#peliculas');
    info.innerHTML = '';    
    info.innerHTML = `<thead>
      <tr>
        <th class="label-cell">N°</th>
        <th class="label-cell">Title</th>
        <th class="label-cell">Year</th>                                      
        <th class="label-cell">Rating</th>
        <th class="label-cell">Metascore</th>
        <th class="label-cell">Director</th>
      </tr>
    </thead>`;   
    

    for(var x=0;x<Object.keys(datos.response).length;x++){
        // console.log(datos.response[x]['title']);   
        info.innerHTML += `<tr>
        <td class="label-cell">${x+1}</td>
        <td class="label-cell">${datos.response[x]['title']}</td>
        <td class="label-cell">${datos.response[x]['year']}</td>
        <td class="label-cell">${datos.response[x]['rating']}</td>
        <td class="label-cell">${datos.response[x]['metascore']}</td>
        <td class="label-cell">${datos.response[x]['director']}</td>
        </tr>`
    }         
  }

  
  // ENVIA NOTIFICACION AL SERVICIO, CON RUT(18339924-1) Y NOMBRES DE LAS PELICULAS ORDENADAS POR METASCORE
  function notificarRecibo(data){

    let datos = JSON.parse(data);

    datos.response.sort(function(a,b){
      return(b.metascore - a.metascore)
    })

    var peliMetascore = [];
    for(var x=0;x<Object.keys(datos.response).length;x++){
       peliMetascore.push(datos.response[x]['title']);       
    }
    app.request.postJSON('https://prod-62.westus.logic.azure.com/workflows/779069c026094a32bb8a18428b086b2c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=o_zIF50Dd_EpozYSPSZ6cWB5BRQc3iERfgS0m-4gXUo', { RUT:'18339924-1', Peliculas: peliMetascore }, function (data) {
      console.log(data);
    });
  }

  

 

  





  
  






  
