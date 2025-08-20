const emitAppointmentCreated = (io, data) => {
    io.to(`patient:${data.patientUsername}`).emit("appointment:created", data);
    io.to("admin").emit("appointment:created", data);

    io.to(`doctor:${data.doctorUsername}`).emit("calendar:update", data);
    io.to(`patient:${data.patientUsername}`).emit("calendar:update", data);
};


const emitAppointmentCancelled = (io, data) => {
    io.to(`patient:${data.patientUsername}`).emit("appointment:cancelled", data);
    io.to("admin").emit("appointment:cancelled", data);

    io.to(`doctor:${data.doctorUsername}`).emit("calendar:update", data);
    io.to(`patient:${data.patientUsername}`).emit("calendar:update", data);
};

const emitAppointmentUpdated = (io, data) => {
    io.to(`patient:${data.patientUsername}`).emit("appointment:updated", data);
    io.to("admin").emit("appointment:updated", data);

    io.to(`doctor:${data.doctorUsername}`).emit("calendar:update", data);

    io.to(`patient:${data.patientUsername}`).emit("calendar:update", data);
};


export { emitAppointmentCreated, emitAppointmentCancelled, emitAppointmentUpdated }