import moment from 'moment'
import requestPromise from 'request-promise'
const cheerio = require('cheerio')
//http://horarios.renfe.com/cer/hjcer310.jsp?&nucleo=40&o=65003%20&d=65206&tc=DIA&td=D&df=20190904&th=1%20&ho=00&i=s&cp=NO&TXTInfo=
function generateURL (data) {               
                                          
    return `http://horarios.renfe.com/cer/hjcer310.jsp?&nucleo=${data.cdgoNucleo}&o=${data.estacionOrigen}&d=${data.estacionDestino}&tc=DIA&td=D&df=${data.fchaViaje}&th=1%20&ho=00&i=s&cp=NO&TXTInfo=`
}
function createCriteryTrip(overrides={}) {
    console.log(overrides)
    const fchaViaje = moment(overrides.date || undefined).format('YYYYMMDD')
    // let mapStations = {
    //     "Nules": "65206",
    //     "Cabanyal": "65003"
    // }
    // let isDefaultIda = overrides.isIda || moment().isSameOrAfter(moment('12:00','HH:mm'), 'minutes')
    let estacionOrigen =  overrides.o
    let estacionDestino = overrides.d

    // let mapStations = {
    //     "Nules": "65206",
    //     "Cabanyal": "65003"
    // }
    // let isDefaultIda = overrides.isIda || moment().isSameOrAfter(moment('12:00','HH:mm'), 'minutes')
    // let estacionDestino =  mapStations[Object.keys(mapStations)[isDefaultIda ? 0 : 1]]
    // let estacionOrigen =  mapStations[Object.keys(mapStations)[isDefaultIda ? 1 : 0]]
    return ({
        cdgoAplicacion: "CER",
        cdgoNucleo: "40",
        cdgoTerminal: "000000",
        fchaViaje,
        horaViajeLlegada: "26",
        horaViajeOrigen: "00",
        validaReglaNegocio: false,
        estacionDestino,
        estacionOrigen
    })
}
async function callData (params) {
    const uri = generateURL(createCriteryTrip(params))
    try{
        const response = await requestPromise({
            // uri: "http://horarios.renfe.com/cer/hjcer310.jsp?&nucleo=40&o=65003%20&d=65206&tc=DIA&td=D&df=20190904&th=1%20&ho=00&i=s&cp=NO&TXTInfo=",
            uri,
            headers: {
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
            },
            gzip: true
        })
        let $ = cheerio.load(response)
        let origen = $('body > div:nth-child(4)').text().trim()
        let destino = $('body > div:nth-child(7)').text().trim()
        let dayTime = $('body > span.titulo_negro').text().trim()
        let tabla = []
        $('#tabla > tbody > tr').each((i, elm) => {
            let fila = []
            $(elm).find('td').each((u, td) => {
                let text = $(td).text().trim()
                fila.push(text)
            })
            tabla.push(fila)
        })
        return { origen, destino, dayTime, data: tabla}

    } catch (err){ 
        console.log(err)
    }
}

export default callData