const table = document.querySelector("#std-tbl");
const baseUrl = "http://localhost:3000/students";
const headers = {
    "Accept": "application/json", // data being accepted by server
    "Content-Type": "application/json" // content of the data being sent
}
const tableDataDef = d=>{
    table.innerHTML+=`
            <tr>
                <td>${d.id}</td>
                <td>${d.rollnumber}</td>
                <td>${d.name}</td>
                <td>${d.email}</td>
                <td>
                    <button class="btn btn-warning edit-button">Edit</button> |
                    <button class="btn btn-danger delete-button">Delete</button>
                </td>
            </tr>
        `;
    
    const editBtns = document.querySelectorAll(".edit-button");
    editBtns.forEach(btn=>{
        btn.addEventListener("click",()=>{
            const id = document.querySelector("#id");
            const rollnumber = document.querySelector("#rolnumber");
            const name = document.querySelector("#name");
            const email = document.querySelector("#email");
            const tr = btn.parentElement.parentElement;
            id.value = tr.children[0].innerText;
            rollnumber.value = tr.children[1].innerText;
            name.value = tr.children[2].innerText;
            email.value = tr.children[3].innerText;
        })
    })

    const deleteBtns = document.querySelectorAll(".delete-button");
    deleteBtns.forEach(btn=>{
        btn.addEventListener("click",()=>{
            if(confirm("Are you sure you want to delete this record?")){
                const tr = btn.parentElement.parentElement;
                const id = tr.children[0].innerText;
                //Delete Student Record from API
                fetch(
                    `${baseUrl}/${id}`,
                    {
                        method:"DELETE",
                        headers:headers
                    }
                )
                .then(response=>{
                    if(response.ok){
                        tr.remove();
                    }
                })
                .catch(error=>console.log(error))
            }            
        })
    })
}
fetch(
    baseUrl,
    {
        method:"GET",
        headers:headers
    }
)//Call
.then(response=>{
    if(response.ok){
        return response.json();
    } else {
        return null;
    }
})//Response
.then(data=>{
    //display data logic
    data.forEach(d=>{
        tableDataDef(d);
    })
    
})//Data
.catch(error=>console.log(error))


const btnSave = document.querySelector("input[type=submit]");
btnSave.addEventListener("click", e=>{
    e.preventDefault();
    const id = document.querySelector("#id");
    const rollnumber = document.querySelector("#rolnumber");
    const name = document.querySelector("#name");
    const email = document.querySelector("#email");
    if(id.value===""){
        const std = {
            rollnumber:rollnumber.value,    
            name:name.value,
            email:email.value
        }
        fetch(
            baseUrl,
            {
                method:"POST",
                headers:headers,
                body:JSON.stringify(std)
            }
        )
        .then(response=>response.json())
        .then(data=>{
            tableDataDef(data);
        })
        .catch(e=>console.log(e))
    } else {
        const std = {
            rollnumber:rollnumber.value,
            name:name.value,
            email:email.value
        }
        fetch(
            `${baseUrl}/${id.value}`,
            {
                method:"PUT",
                headers:headers,
                body:JSON.stringify(std)
            }
        )
        .then(response=>response.json())
        .then(data=>{
            Array.from(table.children).forEach(tr=>{
                if(tr.children[0].innerText==data.id){
                    tr.children[1].innerText=data.rollnumber;
                    tr.children[2].innerText=data.name;
                    tr.children[3].innerText=data.email;
                }
            })
        })
        .catch(e=>console.log(e))
    } 
    id.value="";
    rollnumber.value="";
    name.value="";
    email.value="";
})



