const Regex = {
    id: /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/,
    filename: /^[^/\r\n]{1,256}$/,
    filecontent: /^[^\r\n]*$/,
    username: /^(?!.*\.\.)[A-Za-z\d_\.\-]{2,32}$/,
    password: /^.{8,64}$/,
    image: /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/,
    description: /^.{0,512}$/
}

module.exports = Regex;
