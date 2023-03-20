import { Notify } from "quasar";

const notify = (message, color = 'primary', icon = null, caption = '', position = 'top-right', timeout = 1000,) => {
    Notify.create({
        message: message,
        color: color,
        icon: icon,
        position: position,
        caption: caption,
        timeout: timeout
    })
}

export default notify;