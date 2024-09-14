//========== Modal de registro ==============
var myModal = new bootstrap.Modal(document.getElementById('myModal'), {keyboard: false});

function Abrir_Frm_Produccion(){myModal.show();}
//================================================

function mostrarproductos (idunida){
    let datos = new URLSearchParams;
    datos.append("codigoup",idunida);
    fetch('/llamarproductos',
    {   method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        data.forEach(producto => {
            let name = value=producto.nameup;
            document.getElementById('nameup').innerHTML = name;
        });
        let html = '';
        for(let i =0; i<data.length; i++){
            html += `<option value="${data[i].Codigo_pdto}" class="visible">${data[i].Namepdto} ${data[i].Descpdto}</option>`;
        }
        document.getElementById('pdto').innerHTML = html;
    });
} 

//===============Modal para actualizar ===============
//===============Listado de produccion ===============
function Listar_Produccion(){
    let valor = document.getElementById("unidadesPrd"). value;
    let datos = new URLSearchParams;
    datos.append('unidad',valor)
    fetch('/Listar_Produccion',{
        method:'post',
        body: datos,
        headers: {
            'Authorization': 'Bearer '+ token,
        }
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data)
        var tabla='';
        for(var i=0; i<data.length;i++){
            tabla += '<tr><td class="infocenter">'+data[i].Id_produccion+'</td>';
            tabla += '<td class="infocenter">'+data[i].Nombre+' '+data[i].Descripcion+'</td>';
            tabla += '<td class="infocenter">'+data[i].fecha+'</td>';
            tabla += '<td class="infocenter">'+data[i].Cantidad+'</td>';
            tabla += '<td class="infocenter">'+data[i].Observacion+'</td>';
            tabla += '<td class="infocenter"></td>';
            tabla += '</tr>';
        }
        $('#tablaProducccion').DataTable().destroy();
        document.getElementById('tabla').innerHTML=tabla;
        $('#tablaProducccion').DataTable({
            destroy: true,
            processing : true
        });
        mostrarproductos(valor);
    });
}

function RegistrarProduccion() {
    /* =================fecha local============= */

    let form = document.getElementById('form-produccion');
    var cant=document.getElementById('cantidad').value;
    var obser=document.getElementById('observacion').value;
    var fkpdto = document.getElementById('pdto').value;
    if(cant == 0){
        alert('Por favor ingrese una cantidad')
    }
    else{

    var datos= new URLSearchParams();
    
    datos.append('Cantidad',cant);
    datos.append('Observacion',obser);
    datos.append('fkp',fkpdto)

    fetch('/formR',{
        method:'post',
        body: datos,
        headers: {'Authorization': 'Bearer '+ token}
    }
    ).then(res=>res.json())
    .then(data=>{
        if(data.status == 401) return console.log(data);
        myModal.hide();
        Swal.fire({
            title: data.titulo,
            icon: data.icono,
            text: data.mensaje,
            showConfirmButton: false,
            timer: 1000
        })
        Listar_Producciones();
    });
    form.reset();
}
}

