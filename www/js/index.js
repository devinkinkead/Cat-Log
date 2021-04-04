
var dataOutput = {}
let request = async () => {
    const test = fetch('/petData')
    .then (
        function(value) {
            data = value.json()
            return data  
        }
    
    )

    var bam = []
    bam = await test
    bam = JSON.parse(bam)
    
    // Can do the html shit here
    // console.log('test:'+ bam)
    // console.log(bam.length)
    // console.log(bam)

    
    for (let i=0; i<bam.length;i++) {
        var select = document.getElementById('petName')
        var opt = document.createElement('option')
        opt.value = bam[i]['Pet']
        opt.innerHTML = bam[i]['Pet']
        select.appendChild(opt)
    }
 
   


}


request()