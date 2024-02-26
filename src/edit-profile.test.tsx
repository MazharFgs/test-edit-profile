import React from "react"
import {screen, render} from "@testing-library/react"

import {EditProfile} from "./edit-profile";

describe("EditProfile", () => {
    it("should render the component", () => {
        render(<EditProfile contentLanguage="en_US" message="World"/>);

        expect(screen.getByText(/Hello World/)).toBeInTheDocument();
    })
})
