let url = "https://adktech.ru/storage"
class Api{
    static getTest() {
        return fetch(url + '/get?key=test_key', {
            method: 'GET',
            mode: 'cors',
        }).then((response) => {
            return response.json();
        })
    }
    static setTest() {
        return fetch(url + '/set', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'key=test_key&value=%7B%22title%22%3A%22Hello%20World%21%22%2C%22array%22%3A%5B%22one%22%2C%22two%22%5D%7D&pass=fast50let',
        })
    }

    static setContent(key: string, value: string) {
        console.log("то",value)
        console.log(`${encodeURIComponent(value)}`)
        return fetch(url + '/set', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            // eslint-disable-next-line no-useless-concat
            body: 'key=' + key + '&value=' + `${encodeURIComponent(value)}` + '&pass=fast50let',
        })
    }

    static getContent(key: string) {
        return fetch(url + '/get?key=' + key, {
            method: 'GET',
            mode: 'cors'
        }).then((response) => {
            return response.json();
        })
    }
}
export default Api