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

const LanguageContext = createContext("");


// const defaultglobal = ["Compliance and Litigation", "Private Equity"];
// const defaultglobal = ["Crisis & Issues Management","Strategy & Reputation"];

interface languages {
  [key: string]: string;
}

interface LanguageProps {
  // practiceRef: any
  filteAttr: { languages: [{ [key: string]: string }] };
  languagedefault: any;
  languageRef:any
}

export const LanguageDropdown: React.FC<[]> = (
  filteAttr,
  languagedefault
) => {
  console.log("filteAttr" , filteAttr)

  // console.log("defaultvalueslocal , lang", filteAttr?.languagedefault?.storyblokResolves?.languages)


  const defaultvalueslocal = filteAttr?.languagedefault?.storyblokResolves?.languages;
  console.log("defaultvalueslocal , lang", defaultvalueslocal)
  // const defaultvalueslocal =[
  //   {
  //       "_uid": "45f20bd4-b026-4695-9504-a64b304421cc",
  //       "name": "English",
  //       "value": "english"
  //   },
  //   {
  //       "_uid": "b52d008a-a69c-42e1-93c5-8e18fb3915d7",
  //       "value": "german",
  //       "name": "German"
  //   },]
  const finaldefault = defaultvalueslocal?.map((e:any)=>{
    return {"label":e.charAt(0).toUpperCase()+e.slice(1) , "value":e}
})
    var FinalDefaultresult = finaldefault && finaldefault?.map((e:any)=>{
      return e.label
  })
  const lastFinal = FinalDefaultresult ? FinalDefaultresult : [];
  const [selected, setSelected] = useState<any>(lastFinal);
 
  const options = Object.values(filteAttr)[0]?.options?.languages?.map((e: any) => {
    const v = Object.values(e)[1];
    return v.charAt(0).toUpperCase()+v.slice(1)
  });


  const isAllSelected =
    options?.length > 0 && selected?.length === options?.length;

  const handleChange = (event: any) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(selected.length === options.length ? [] : options);
      return;
    }
    setSelected(value);
    console.log("State Values", value);
  };
  useEffect(() => {}, []);

  useEffect(() => {
    // setSelected(FinalDefaultresult);
  }, [selected]);

  return (
    <LanguageContext.Provider value={selected}>
      <div style={{ marginTop: 6 }}>
        <FormControl style={{ width: 350 }}>
          <Select
            labelId="mutiple-select-label"
            // defaultValue={filteAttr && Object.keys( filteAttr && filteAttr?.practisedefault?.storyblokResolves?.practice_areas[0])}
            placeholder="Select"
            defaultValue={lastFinal}
            // defaultValue={[]}
            // ref={practiceRef}
            multiple
            name="language_multiselect"
            value={selected}
            onChange={handleChange}
            defaultChecked={true}
            renderValue={(selected: any) => selected.join(", ")}
            //   MenuProps={MenuProps}
            sx={{
              width: 450,
              ".MuiOutlinedInput-notchedOutline": {
                borderStyle: "none",
                borderBottomStyle: "solid",
                borderRadius: "unset",
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  width: 450,
                },
              },
            }}
          >
            <MenuItem
              value="all"
              sx={{ width: 450 }}
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
    </LanguageContext.Provider>
  );
};
