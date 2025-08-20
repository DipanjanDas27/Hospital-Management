const notifyUsers = (io, {
    patientUsername,
    messageForPatient = null,
    notifyadmin = false,
    messageForAdmin = null,
    doctorUsername,
    messageForDoctor = null
}) => {
    if (patientUsername && messageForPatient) {
        io.to(`patient:${patientUsername}`).emit("notification", messageForPatient);
    }

    if (notifyadmin && messageForAdmin) {
        io.to(`admin`).emit("notification", messageForAdmin);
    }
    if (doctorUsername && messageForDoctor) {
        io.to(`doctor:${doctorUsername}`).emit("notification", messageForDoctor);
    }
};
export { notifyUsers }