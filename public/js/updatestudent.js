// console.log("hy")
// $("#update_student").submit(function(event){
//     event.preventDefault();
//     alert("click")

//     var unindexed_array = $(this).serializeArray();
//     var data = {}

//     $.map(unindexed_array, function(n, i){
//         data[n['name']] = n['value']
//         console.log(data);
//     })


//     var request = {
//         "url" : `http://localhost:5000/admin/student/:${data.sid}`,
//         "method" : "PUT",
//         "data" : data
//     }

//     $.ajax(request).done(function(response){
//         alert("Data Updated Successfully!");
//     })

// })