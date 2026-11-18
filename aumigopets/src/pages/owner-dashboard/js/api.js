const URL_BASE = 'http://127.0.0.1:1337/api'

const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwic2Vzc2lvbklkIjoiNjhlM2UwY2FlZDEyNGI1ZmRmNDkyMDM5NTBmN2M2MGYiLCJ0eXBlIjoiYWNjZXNzIiwiaWF0IjoxNzk1MDM4ODMyLCJleHAiOjE3OTUwMzk0MzJ9._2Qud37bZiWJ9nxPZ4dPt5i1RB0ix-Yz58p-FXqVwyQ";

export async function listAll(endpoint) {
    const response = await fetch(URL_BASE + endpoint, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + testToken
        }
    });

    if (!response.ok) {
        console.log("Deu erro man -> " + response.status);
        return;
    }

    const data = await response.json();
    console.log(data);
}

