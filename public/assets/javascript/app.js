$(document).ready(function(){
    console.log(`FRONT END JAVASCRIPT LOADED`);
    $(".container").append(`<p>FRONT END LOADED</p>`);



    $.getJSON(`/articles`, function(package){
        console.log(package);
        for( i = 0; i < package.length; i++){
            $(`.row`).append(`<div class = "adf col-md-3">
                                    <div class="card" style="width: 18rem;">
                                        <img class="card-img-top img-fluid" src="${package[i].imgLink}" alt="Card image cap">
                                        <div class="card-body">
                                            
                                            <p class="card-text" id = ${package[i]._id}>${package[i].title}</p>
                                            <a href="${package[i].link}" class="btn btn-primary" id = "visit">Visit</a>
                                            <a class="btn btn-primary" id = "notes" value = ${package[i]._id} data-toggle="modal" data-target="#Noted">Notes</a>
                                        </div>
                                    </div>
                                </div>`);


        }
    
    });

    $(`.row`).on("click","#notes", function(){
       
        $(`#save`).attr("value", $(this).attr(`value`))

        console.log($(this).attr(`value`));
        console.log($(`#save`).attr(`value`));

        
        
        $.ajax({
            method: `GET`,
            url: `/articles/${$(`#save`).attr(`value`)}`,
          }).then(function(data) {
            
              console.log(`FRONT END${data}`);
              $(`#message-text`).val(`SAVED: ${data}`);
              $(`#message-text`).html(`SAVED: ${data}`);
        });



    });

    $(`.modal-footer`).on("click", `#save`, function(){
        console.log(`SAVED`);
        console.log($(`#message-text`).val());
        console.log($(`#save`).attr(`value`));



        $.ajax({
            method: `POST`,
            url: `/articles/${$(`#save`).attr(`value`)}`,
            data: {
              body: $(`#message-text`).val()

            }
          }).then(function(data) {
              console.log(data);
              
              
            });








    });


    













});
