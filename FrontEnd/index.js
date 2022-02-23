const api_url = 'http://192.168.1.106:8080/'

// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    
    show(data);
}

// Calling that async function
getapi(api_url);

function show(data) {
    
    let tab = ''
    numberOfBunches = 9

    // Loop to access all rows 
    let len = data.length;
    if (len > numberOfBunches){
        len = numberOfBunches
    }

    let ids = ids()
    for (let i = (len-1); i >= 0; i--) {
        if(data[i].size == 0){
            continue;
        }

        //if (ids.inclides(data[i])){
            logo = '<img class="logo" height="15px" src="img/zp.png">';
        //}
        pic = '<img class="riders" height="36px" src="img/';
        switch (data[i].size) {
            case 1:
                pic += 'one.png">';
                break;
            case 2:
                pic += 'two.png">';
                break;
            case 3:
                pic += 'three.png">';
                break;
            case 4:
                pic += 'four.png">';
                break;
            case 5:
                pic += 'five.png">';
                break;
            case 6:
                pic += 'six.png">';
                break;
            default:
                pic = '<img height="36px" src="img/bunch.png">';
        }

        tmp = 'riders in group'
        if ( data[i].size == 1){
            tmp = 'rider'
        }
        if ( i == 0){
            dist = Math.round(data[i].distance * 100) / 100
            dist = `${dist} km`
        }
        else{
            dist = data[i].gap
            dist = `${dist} m to next group`
        }
        speed = Math.round(data[i].speed * 10) / 10
        
        tab += `
                <td id="inner">${pic}${logo}
                    <p><span><br>
                    ${data[i].size} ${tmp}<br>
                    ${speed} km/h<br>
                    ${dist}<br>           
                    </span></p>
                </td>`;
    
    }
    url_string = "https://example.com?options[]=one&options[]=two";
    url = new URL(url_string);
    options = url.searchParams.getAll("options[]");
    // Setting innerHTML as tab variable
    document.getElementById("wrap").innerHTML = tab;
    document.getElementById("test").innerHTML = options;
}

