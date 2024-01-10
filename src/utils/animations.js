export function goToTop(){
    document.getElementsByTagName("main")[0].scrollTo({
        top: 0,
        behavior:"smooth"
    })
}

export function clickTab(elementId, setTab){

    if(elementId === "profile" || typeof(elementId) === "number"){
        window.location = `/user/${elementId}`
    }else if(elementId === "home"){
        window.location = "/"
    }else{
        window.location = `/${elementId}`
    }

    setTab(elementId)
}