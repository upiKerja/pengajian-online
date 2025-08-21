async function mainData() {
    var slug = window.location.href.split("/")[4]
    try {
        const response = await axios.get(`http://localhost:8081/kelas/index/${slug}`);
        return response.data
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            document.querySelector("body").innerHTML = "404"
        }
    }
}

async function fetch_get_data(url) {
    try {
        const response = await axios.get(url());
        document.querySelector("#loading").classList.add("hidden")

        return response.data
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            document.querySelector("body").innerHTML = "<h1>404</h1>"
        }
    }    
}