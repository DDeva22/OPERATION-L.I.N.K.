$(document).ready(function(){
    console.log(`FRONT END JAVASCRIPT LOADED`);
    $(".container").append(`<p>FRONT END LOADED</p>`);



    $.getJSON(`/articles`, function(package){
        console.log(package);
        for( i = 0; i < package.length; i++){
            $(`#card`).append(`<div class="card" style="width: 18rem;">
                                        <img class="card-img-top" src="${package[i].imgLink}" alt="Card image cap">
                                        <div class="card-body">
                                        
                                        <p class="card-text" id = ${package[i]._id}>${package[i].title}</p>
                                        <a href="${package[i].link}" class="btn btn-primary">Visit</a>
                                        <a class="btn btn-primary" id = "notes" value = ${package[i]._id}>Notes</a>
                                        </div>
                                    </div>`);


        }
    
    });

    $(`#card`).on("click","#notes", function(){
        
        console.log(`CLICKED`);
        console.log($(this).attr(`value`));
        $(`#${$(this).attr(`value`)}`).append(`<textarea id='bodyinput' name='body' value = '${$(this).attr(`value`)}'></textarea>`);
        $(`#${$(this).attr(`value`)}`).append(`<button id='savenote' value = '${$(this).attr(`value`)}'>Save Note</button>`);

        





    });


    $(`#card`).on("click","#savenote", function(){
        console.log(`SAVED ${$(this).attr(`value`)}`);
        $(`#${$(this).attr(`value`)}`).remove();


    });













});
