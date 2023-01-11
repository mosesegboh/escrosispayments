const verificationEmailSuccess = ({currentUrl,  uniqueString,  _id}) => {
    const subject = `Verify Your Email`

    const body = `<p>Please verify your email address to complete the sign up process and login into your account.</p>
    <p>This link <b>expires in 6 hours</b>.</p><p>Click on the link: <a href=${currentUrl + 'user/verify/' + _id + '/' + uniqueString}>
    here<a/>to proceed.</p>`
    
    return [subject, body]
}

module.exports = {verificationEmailSuccess}