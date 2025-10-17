import { axiosClient } from "../axiosConfig"

const MAIL_URL = `/mail`;

export const getMail  = async() => {
    const res = await axiosClient.get(`${MAIL_URL}`)
    return res.data
}

export const deleteMail = async(mailid:any) => {
    const res = await axiosClient.delete(`${MAIL_URL}/${mailid}`)
    return res.data
}