const d1 = document.getElementById("auth.signin");
const i1 = document.getElementById("IMG-SIGNIN");
const t1 = document.getElementById("TXT-SIGNIN");

const d2 = document.getElementById("auth.signup");
const i2 = document.getElementById("IMG-SIGNUP");
const t2 = document.getElementById("TXT-SIGNUP");

const wrapper = document.getElementById("wrapper");

const SIGNIN = document.getElementById("SIGIN");
const SIGNUP = document.getElementById("SIGNUP");
let remain = null;

d1.onclick = function () {
    d1.classList.add("active");
    i1.src = '../static/svg/ui/normal/ui.user.svg';
    t1.classList.add("active");

    d2.classList.remove("active");
    i2.src = '../static/svg/ui/active/ui.user_add.svg';
    t2.classList.remove("active");

    SIGNUP.style.display = "none";

    wrapper.style.height = "500px";

    SIGNIN.style.display = "block";
}

d2.onclick = function () {
    d2.classList.add("active");
    i2.src = '../static/svg/ui/normal/ui.user_add.svg';
    t2.classList.add("active");

    d1.classList.remove("active");
    i1.src = '../static/svg/ui/active/ui.user.svg';
    t1.classList.remove("active");

    SIGNIN.style.display = "none";

    wrapper.style.height = "580px";

    SIGNUP.style.display = "block";
}


function showPassword(event) {
    const passwordField = event.target.closest('.password-container').querySelector('input[type="password"], input[type="text"]');
    passwordField.type = "text";
}

function hidePassword(event) {
    const passwordField = event.target.closest('.password-container').querySelector('input[type="password"], input[type="text"]');
    passwordField.type = "password";
}

function makeToast(message, _typeOf, autoKill = true) {
    const toast = document.getElementById('toast');
    const msg   = document.getElementById('toast:message');
    ['success', 'error'].forEach(element => {
        toast.classList.remove(element);
    });
    switch (_typeOf) {
        case 'E':
            toast.style.display = 'flex';
            toast.classList.add('error');
            msg.textContent = message;
            break;
        case 'S' :
            toast.style.display = 'flex';
            toast.classList.add('success');
            msg.textContent = message;
            break;
        default:
            break;
    }
    if (autoKill == true) {
        setTimeout(() => {
            document.getElementById('toast').style.display = 'none';
        },3000)
    }
}


async function SignUp() {
    document.getElementById("form-SIGNUP").submit();

    const name = document.getElementById('auth-form-SIGNUP.name');
    const username = document.getElementById('auth-form-SIGNUP.username');
    const password = document.getElementById('auth-form-SIGNUP.password');
    const cpassword = document.getElementById('auth-form-SIGNUP.cpassword');

    const OTP = `${document.getElementById('otp_1').value}${document.getElementById('otp_2').value}${document.getElementById('otp_3').value}${document.getElementById('otp_4').value}${document.getElementById('otp_5').value}${document.getElementById('otp_6').value}`;
    const agree = document.getElementById('agree');

    const formData = new FormData();

    formData.append('signup.name', name.value);
    formData.append('signup.username', username.value);
    formData.append('signup.password', password.value);
    formData.append('signup.cpassword', cpassword.value);
    formData.append('signup.otp', OTP);
    formData.append('signup.agree', agree.value);
    try {
        
        const response = await fetch(`/`, {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        if (data) {
            if (data.msg) {
                makeToast(data.msg, 'E', true);
            }else if (data.OK) {
                remain = 4;
                setInterval(() => {
                    remain = remain - 1
                    makeToast(`Redirecting in ${remain}...`, 'S', false)
                    if (remain == 0) {
                        location.reload();
                    }
                }, 1000);
            }
        }
    } catch (error) {
    
    }

}

async function SignIn() {
    const container = document.getElementById('container');
    const username = document.getElementById('auth-form-SIGNIN.username').value;
    const password = document.getElementById('auth-form-SIGNIN.password').value;

    const formData = new FormData();
    formData.append('login.username', username);
    formData.append('login.password', password);
    try {
        const response = await fetch(`/`, {
            method: 'POST',
            body: formData
        })

        const data = await response.json()
        if (data) {
            if (data.url) {
                const URLX = document.location.origin + data.url
                location.href = URLX
                return;
            }
        }
    } catch (error) {

    }

}