export const ParseEmail = (email) => {
    if (email.includes("@") && email !== 'ANDi@and.digital') {

        let name = email.split("@")[0];
        
        if (name.includes(".")) {

            let firstName = Capitalise(name.split(".")[0]);
            let lastName = Capitalise(name.split(".")[1]);

            if (lastName.includes("-")) {
                let lastNameSplit = lastName.split("-");
                lastName = lastNameSplit[0] + "-" + Capitalise(lastNameSplit[1]);
            }

            return firstName + " " + lastName;
        } else {
            return name.charAt(0).toUpperCase() + "." + Capitalise(name.slice(1));
        }
    } else {
        return "ANDi";
    }

    function Capitalise(s) {
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

}