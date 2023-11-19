const yts = require( 'yt-search' )

async function fetch()  { 
    var data = await yts('hello world')
    return data
}

r = fetch()
r.then(function(result) {
    const videos = result.videos.slice( 0, 3 )
    videos.forEach( function ( v ) {
        const views = String( v.views ).padStart( 10, ' ' )
        console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name }` )
    } )
})

//const videos = r.videos.slice( 0, 3 )
//videos.forEach( function ( v ) {
	//const views = String( v.views ).padStart( 10, ' ' )
	//console.log( `${ views } | ${ v.title } (${ v.timestamp }) | ${ v.author.name }` )
//} )
