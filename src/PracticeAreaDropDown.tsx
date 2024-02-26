import React, { useEffect, createContext, createRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState } from "react";
import { toHaveFormValues } from "@testing-library/jest-dom/matchers";

const PracticeContext = createContext("");


// const defaultglobal = ["Compliance and Litigation", "Private Equity"];
const defaultglobal = ["Crisis & Issues Management","Strategy & Reputation"];

interface practice_areas {
  [key: string]: string;
}

interface PracticeProps {
  // practiceRef: any
  filteAttr: { practice_areas: [{ [key: string]: string }] };
  practisedefault: any;
  practiceRef:any
  handlePracticeSelected:any;
}

export const PracticeAreaDropDown: React.FC<PracticeProps> = (
  filteAttr,
  practisedefault,
) => {

  const def = filteAttr?.practisedefault?.storyblokResolves?.practice_areas;
  const defaultvalueslocal = def ? def : [];

  const finaldefault = defaultvalueslocal && defaultvalueslocal?.map((e:any)=>{
    return {"label": Object.keys(e)[0], "value":Object.values(e)[0]}
})
    const FinalDefaultresult = finaldefault && finaldefault?.map((e:any)=>{
        return e.label
    })
    const lastFinal = FinalDefaultresult ;
  const [selected, setSelected] = useState<any>(lastFinal);
//   const filterchaged = localjse.map((e)=>{
//     return {"label": Object.keys(e)[0] , "value": Object.values(e)[0]}
//   })
const filterChanged = Object.values(filteAttr)[0]?.practise_areas?.map((e: any) => {
    return {"label": Object.keys(e)[0] , "value": Object.values(e)[0]}
  });
  const options = filterChanged?.map((e:any)=> e.label)
  const isAllSelected =
    options?.length > 0 && selected?.length === options?.length;

  const handleChange = (event: any) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
    filteAttr.handlePracticeSelected(value,lastFinal);
    console.log("State Values", value);
  };
  useEffect(() => {}, []);

  useEffect(() => {
    // setSelected(FinalDefaultresult);
  }, [selected]);

  return (
    <PracticeContext.Provider value={selected}>
      <div style={{ marginTop: 6 }}>
        <FormControl>
          <Select
            labelId="mutiple-select-label"
            // defaultValue={filteAttr && Object.keys( filteAttr && filteAttr?.practisedefault?.storyblokResolves?.practice_areas[0])}
            placeholder="Select"
            defaultValue={lastFinal}
            // defaultValue={[]}
            // ref={practiceRef}
            multiple
            name="practise_multiselect"
            value={selected}
            onChange={handleChange}
            defaultChecked={true}
            renderValue={(selected: any) => selected.join(", ")}
            //   MenuProps={MenuProps}
            sx={{
              width: 590,
              ".MuiOutlinedInput-notchedOutline": {
                borderStyle: "none",
                borderBottomStyle: "solid",
                borderRadius: "unset",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  width: 350,
                },
              },
            }}
          >
            <MenuItem
              value="all"
              sx={{ width: 350 }}
              // classes={{
              //   root: isAllSelected ? classes.selectedAll : ""
              // }}
            >
              <ListItemIcon>
                <Checkbox
                  // classes={{ indeterminate: classes.indeterminateColor }}
                  checked={isAllSelected}
                  indeterminate={
                    selected?.length > 0 && selected?.length < options?.length
                  }
                />
              </ListItemIcon>
              <ListItemText
                // classes={{ primary: classes.selectAllText }}
                primary="Select All"
              />
            </MenuItem>
            {options?.map((option: any, i: any) => (
              <MenuItem key={i} value={option} sx={{ width: 350 }}>
                <ListItemIcon>
                  <Checkbox checked={selected?.indexOf(option) > -1} />
                </ListItemIcon>
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </PracticeContext.Provider>
  );
};
