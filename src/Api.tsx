let url = "http://192.168.31.12:8000"
class Api{
    static setSection(name: string) {
        return fetch(url + '/set-section', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: name})
        }).then((response) => {
            return response.json();
        })
    }

    static getSections() {
        return fetch(url + '/get-sections', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => {
            return response.json();
        })
    }

    static setTheme(section: string, theme: string) {
        let formData = new FormData();
        return fetch(url + '/set-theme?section=' + section + '&theme=' + theme, {
            method: 'POST',
            mode: 'cors',
            body: formData
        }).then((response) => {
            return response.json();
        })
    }

    static getThemes(section: string) {
        let formData = new FormData();
        return fetch(url + '/get-themes?section=' + section, {
            method: 'POST',
            mode: 'cors',
            body: formData
        }).then((response) => {
            return response.json();
        })
    }
}
export default Api


