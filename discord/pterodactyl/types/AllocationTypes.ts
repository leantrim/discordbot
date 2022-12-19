type Allocations = {
    object: String;
    attributes: allocation;
}

type allocation = {
    id: Number;
    ip: String;
    alias: String;
    port: Number;
    notes: String;
    assigned: Boolean;
}

export default Allocations