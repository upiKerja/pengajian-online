async function fetch_get_data() {
    // let slug = window.location.href.split("/").at(-1)
    let slug = "pernah-kah-kau-merasa"
    let url = "http://localhost:8081/kelas/index/" + slug
    try {
        const response = await axios.get(url);
        document.querySelector("#loading").classList.add("hidden")

        return response.data
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            document.querySelector("body").innerHTML = "<h1>404</h1>"
        }
    }    
}

async function fetch_pertemuan(id_kelas) {
    let url = "http://localhost:8081/kelas/index/" + id_kelas
    try {
        const response = await axios.get(url)
        if (response) {
            return [true, response]
        } else { return [false] }
    } catch (error) {
        return error 
    }
}

async function fetch_pertemuan(id_kelas) {
    // let slug = window.location.href.split("/").at(-1)
    let url = "http://localhost:8081/kelas/" + id_kelas + "/pertemuan"
    const response = await axios.get(url)
    // try {
    //     const response = await axios.get(url);
    //     document.querySelector("#loading").classList.add("hidden")

    //     return response.data
    // } catch (error) {
    //     if (error.response) {
    //         const status = error.response.status;
    //         document.querySelector("body").innerHTML = "<h1>404</h1>"
    //     }
    // }    
    console.log(id_kelas)
    return response.data
}