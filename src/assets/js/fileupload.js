export const fileUpload = () => {
    try {
        const inputField = document.querySelector('#file');
        const notChoosenText = document.querySelector('.calculator__file-choosed');

        if(!inputField.value) {
            notChoosenText.innerHTML = 'файл не выбран'
        }
        inputField.addEventListener('input', (e) => {
            const name = e.target.files[0].name
            notChoosenText.innerHTML = name;
        })

    } catch (error) {
        console.log(error)
    }
}