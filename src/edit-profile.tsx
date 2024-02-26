/*!
 * Copyright 2023, Staffbase GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ReactElement, useEffect, useState, useRef, useContext} from "react";
import { BlockAttributes, SBUserProfile, WidgetApi } from "widget-sdk";
import { useForm, Controller } from "react-hook-form";
import { PracticeAreaDropDown } from "./PracticeAreaDropDown";
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { SectorsDropDown } from "./SectorsDropDown";
import {CapabilitiesDropdown} from"./CapabilitiesDropDown";
import { LanguageDropdown } from "./LanguageDropDown";
// import Select from 'react-select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

/**
 * React Component
 */
// const url ="https://myfgs-staffbase-storyblok-proxy-6nar3kdwr-fgh-global.vercel.app/api/";

// const url ="https://myfgs-staffbase-storyblok-proxy-6nar3kdwr-fgh-global.vercel.app/api/";
const url ="https://myfgs-staffbase-storyblok-proxy-hpageu8h9-fgh-global.vercel.app/api/";


/**
 * React Component
 */
export interface EditProfileProps extends BlockAttributes {
  widgetApi: WidgetApi;
}

export const EditProfile = ({ widgetApi }: EditProfileProps): ReactElement | null  => {


  
  const [user, setUser] = useState<SBUserProfile | null>(null);
  const [countLifeAtFgs, setCountLifeAtFgs] = useState(0);
  const [totalTextAreaLimit] = useState(2000)
  const [countLifePreFgs, setCountLifePreFgs] = useState(0);
  const [countFullBio, setCountFullBio] = useState(0);
  const [countInternalBio, setCountInternalBio] = useState(0);
  const [countLifeBeyondFgs, setCountLifeBeyondFgs] = useState(0);

 const languageRef = useRef();

 const [isLoggedIn,setIsLoggedIn] = useState(false)
 const [loader, setLoader] = useState(true);
 const [singleProfiledata,setsingleProfiledata] = useState<any>([]);
 const [filterAttr, setfilterAttr]= useState<any>([]);
 const [showSuccesAlert, setShowSuccessAlert]= useState(false);
 const [showFailAlert, setShowFailAlert]= useState(false);

 
 const[singledataupdate,setSinggledataupdated]=useState(false);

 const [practiceChanged, setpracticeChanged] = useState(false);
 const [sectorChanged, setsectorChanged]= useState(false);
 const [capabilityChanged, setCapabilityChanged] = useState(false);

 const [selctedPractice, setSelctedPractice]= useState<any>([]);
 const [selctedSectors, setSelctedSectors]= useState<any>([]);
 const[selectedCapability,setSelctedCapability] =useState<any>([]);
//  const options={[
//   { value: 'he', label: 'He' },
//   { value: 'him', label: 'Him' },
// ]}
const [pronounsSelect, setPronounsSelect] = React.useState('');

  const handleChangePronouns = (event: SelectChangeEvent) => {
    setPronounsSelect(event.target.value);
  };
  const {
    // control,
    register,
    // handleSubmit,
    setValue,
    // watch,
    formState: { errors },
  } = useForm();

  // const selected_pronouns= watch("");
  // const selected_lang = watch("")
  // const selected_practice_area = watch("practise_areas");
  // const selected_sectors = watch("sectors");
  // const selected_capabty = watch("capability")

  // const onSubmit = (data: any) => {
  //   console.log(data);
  // };


  useEffect(() => {
    widgetApi.getUserInformation().then((user) => {
      setUser(user);
       verifyToken(user);
    }
    );
  }, []);
  useEffect(() => {
    if(isLoggedIn){
      handleUserDetails();
      handleDrpdwnStoryBlocAttr();
    }
  }, [isLoggedIn]);

 

  const verifyToken = (info) => {
    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    if (checkDirectoryAuthToken) {
      const verifyToken = JSON.stringify({
        // userId: info?.externalID,
        userId: "00uwskbw25UJUbQfl1t7",
        token: checkDirectoryAuthToken,
      });

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${url}auth/verify`,
        headers: {
          "Content-Type": "application/json",
        },
        data: verifyToken,
      };

      axios
        .request(config)
        .then((response) => {
          if(response.data.success){
            // console.log(JSON.stringify(response.data));
            setIsLoggedIn(true);
          }else{
            authenticateUser(info);
          }
         
        })
        .catch((error) => {
          authenticateUser(info);
          // console.log(error);
        });
    } else {
      authenticateUser(info);
    }
  };

  const authenticateUser = (info) => {
    const data = JSON.stringify({
      // userId: info?.externalID,
      userId: "00uwskbw25UJUbQfl1t7",
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url:`${url}auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        localStorage.setItem(
          "directoryAuthToken",
          response.data.token
        );

        localStorage.setItem(
          "loggedEmail",
          response.data.email
        );
        setIsLoggedIn(true);
      })
      .catch((error) => {
        // console.log(error);
      });
  };

  useEffect(()=>{

  },[filterAttr,singleProfiledata,singledataupdate])

  const handleDrpdwnStoryBlocAttr=()=>{
    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    const token = `${checkDirectoryAuthToken}`
    const newToken = token.replace(/^"|"$/g, "");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${url}profiles/attributes`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": newToken
      },
    };
    axios
    .request(config)
    .then((response) => {
      const user  = response.data.data;
      setfilterAttr(response?.data?.data);
    })
    .catch((error) => {
    });
  }

  const handleUserDetails = () => {

    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    const loggedEmail = localStorage.getItem("loggedEmail");
    console.log("loggedEmail" , loggedEmail)

    const token = `${checkDirectoryAuthToken}`
    const newToken = token.replace(/^"|"$/g, "");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      // url: `${url}profiles/${loggedEmail}`,
      url: `${url}profiles/dan.stone@fgsglobal.com`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": newToken
   
      },
    };
    axios
    .request(config)
    .then((response) => {
      const user  = response.data.data
      console.log("ussss" , user?.storyblokResolves?.pronouns)
      setLoader(false);
      setPronounsSelect(user?.storyblokResolves?.pronouns)
      var loc="";
      if(user?.storyblokResolves?.location.length > 0){
        let l=Object.values(user?.storyblokResolves?.location);
        const t= l.map((e)=>{
          return Object.keys(e)

        })
        loc=t.join(", ");
      }
      if(user?.storyblokResolves?.life_at_fgs_global){
        setCountLifeAtFgs(user?.storyblokResolves?.life_at_fgs_global.length)
      }

      if(user?.storyblokResolves?.life_pre_fgs_global){
        setCountLifePreFgs(user?.storyblokResolves?.life_pre_fgs_global.length)
      }
      if(user?.storyblokResolves?.full_bio){
        setCountFullBio(user?.storyblokResolves?.full_bio.length)
      }
      if(user?.storyblokResolves?.life_beyond_fgs_global){
        setCountLifeBeyondFgs(user?.storyblokResolves?.life_beyond_fgs_global.length)
      }
      if(user?.storyblokResolves?.internal_bio){
        setCountInternalBio(user?.storyblokResolves?.internal_bio.length)
      }
    
      
       
      setsingleProfiledata(response.data.data)
      setSinggledataupdated(true)
      setValue('first_name', user?.firstName)
      setValue('last_name', user?.lastName)
      setValue('hr_title', user?.hr_title)
      setValue('work_location', loc)
      setValue('work_anniversary', "")
      setValue('email', user?.email[0]?.value)
      setValue('internal_phone_number', user?.phone[0]?.value)
      setValue('external_phone_number', user?.phone[0]?.value)

      setValue('pronouns', user?.storyblokResolves?.pronouns)
      setValue('language', user?.storyblokData?.language[0])
      setValue('practice_area', user?.storyblokData?.practice_areas)
      setValue('sectors', user?.storyblokResolves?.sectors)
      setValue('capabilities', user?.storyblokData?.capabilities)
      setValue('?.position', user?.storyblokData?.position)
      
      setValue('life_at_fgs',user?.storyblokResolves?.life_at_fgs_global)
      setValue('life_beyo_fgs',user?.storyblokResolves?.life_beyond_fgs_global)
      setValue('life_pre_fgs',user?.storyblokResolves?.life_pre_fgs_global)
      
      setValue('full_bio',user?.storyblokResolves?.full_bio)
      setValue('internal_bio',user?.storyblokResolves?.internal_bio)


      setValue("excutive_assistant", user?.storyblokData?.content?.executive_assistant)



    })
    .catch((error) => {
    });
  }

  const handleSectors= (selected:any,initialvalues:any) => {
    setSelctedSectors(selected);
    setsectorChanged( JSON.stringify(selected)!=JSON.stringify(initialvalues));
  }
  const handlePractice=(selected:any,initialvalues:any)=>{
    setSelctedPractice(selected);
    setpracticeChanged( JSON.stringify(selected)!=JSON.stringify(initialvalues));
  }
  const handleCapability=(selected:any,initialvalues:any)=>{
    setSelctedCapability(selected);
    setCapabilityChanged( JSON.stringify(selected)!=JSON.stringify(initialvalues));
  }

  const handleSaveSubmit = (e:any) => {
    e.preventDefault();

    const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
    const loggedEmail = localStorage.getItem("loggedEmail");

    const token = `${checkDirectoryAuthToken}`
    const newToken = token.replace(/^"|"$/g, "");
    let data:any = e;
    // console.log("data?.target?.pronouns?" , data?.target?.pronouns.value)
    // return;
    
    // console.log("data?.target?.full_bio?.value" , data?.target?.full_bio?.value.replace(/\s{3,}/, '\n'))
    // return

    // const newdata = new FormData(e.target);
    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    //data?.target?.practise_multiselect?.value
    //Practice
    // let selectedPrac =  data?.target?.practise_multiselect?.value.split(",");

    let lang = data?.target?.language_multiselect?.value.split(",");
    const final_lang= lang.map(x => x.replace(/\b\w/g, c => c.toLowerCase()));

    let prac_obj = filterAttr?.practise_areas?.map((e:any)=>{
      return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
    })
    let prac_save_obj = selctedPractice.map((e:any)=>{
        return  prac_obj.filter((ele:any)=> {
        return  ele.label === e})
    })
    let final_pract_save_obj = prac_save_obj.map((ele:any)=>{
      return ele.length > 0 ? ele[0].value : []
    })
    
    //Sectors
    // let selectedSec =  data?.target?.sectors_multiselect?.value.split(",");
    let sec_obj = filterAttr?.sectors?.map((e:any)=>{
      return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
    })
    let sec_save_obj = selctedSectors.map((e:any)=>{
        return  sec_obj.filter((ele:any)=> {
        return  ele.label === e})
    })
    let final_sec_save_obj = sec_save_obj.map((ele:any)=>{
      return ele.length > 0 ? ele[0].value : []
    })

    //Capablities
    // let selectedcapab =  data?.target?.capability_multiselect?.value.split(",");
    let capab_obj = filterAttr?.capabilities?.map((e:any)=>{
      return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
    })
    let capab_save_obj = selectedCapability.map((e:any)=>{
        return  capab_obj.filter((ele:any)=> {
        return  ele.label === e})
    })
    let final_capab_save_obj = capab_save_obj.map((ele:any)=>{
      return ele.length > 0 ? ele[0].value : []
    })



    let saveobj:any = {
      "languages":final_lang,
      "pronouns":  data?.target?.pronouns?.value,

      // "practice_areas":  final_pract_save_obj,
      //  "sectors": final_sec_save_obj,
      //  "capabilities":final_capab_save_obj,
      "executive_assistant": data?.target?.excutive_assistant?.value,
      "full_bio": data?.target?.full_bio?.value,
      "life_at_fgs_global":data?.target?.life_at_fgs?.value,
      "life_pre_fgs_global": data?.target?.life_pre_fgs?.value,
      "life_beyond_fgs_global": data?.target?.life_beyo_fgs?.value,
      "internal_bio": data?.target?.internal_bio?.value
    }
    // console.log(saveobj)
    // return

    if(practiceChanged){
      saveobj.practice_areas = final_pract_save_obj
    }
    if(sectorChanged){
      saveobj.sectors = final_sec_save_obj
    }
    if(capabilityChanged){
      saveobj.capabilities = final_capab_save_obj
    }

    
    
    let config = {
      method: "put",
      maxBodyLength: Infinity,
      // url: `${url}profiles/${loggedEmail}`,
      url: `${url}profiles/dan.stone@fgsglobal.com`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${newToken}`
 
      },
      data: saveobj
    };
 
    axios
      .request(config)
      .then((response) => {
      //  console.log(JSON.stringify(response.data));
        handleUserDetails();
        setShowSuccessAlert(true);
        setTimeout(()=>{
          setShowSuccessAlert(false);
        },3000)
      })
      .catch((error) => {
        setShowFailAlert(true);
        setTimeout(()=>{
          setShowFailAlert(false);
        },3000)

        console.log(error);
      });
    console.log("Final Save Data Payload",saveobj);
  };


  // const handleSaveSubmit_old = (e:any) => {
  //   const checkDirectoryAuthToken = localStorage.getItem("directoryAuthToken");
  //   const token = `${checkDirectoryAuthToken}`
  //   const newToken = token.replace(/^"|"$/g, "");
  //   // let data:any = e;
  //   // e.preventDefault();

  //   // const newdata = new FormData(e.target);
  //   // Access FormData fields with `data.get(fieldName)`
  //   // For example, converting to upper case
  //   //data?.target?.practise_multiselect?.value
  //   //Practice
  //   let lang = data?.target?.language_multiselect?.value.split(",");
  //  const final_lang= lang.map(x => x.replace(/\b\w/g, c => c.toLowerCase()));

  //   let selectedPrac =  data?.target?.practise_multiselect?.value.split(",");

  //   let prac_obj = filterAttr?.practise_areas?.map((e:any)=>{
  //     return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
  //   })
  //   let prac_save_obj = selectedPrac.map((e:any)=>{
  //       return  prac_obj.filter((ele:any)=> {
  //       return  ele.label === e})
  //   })
  //   let final_pract_save_obj = prac_save_obj.map((ele:any)=>{
  //     return ele.length > 0 ? ele[0].value : []
  //   })
    
  //   //Sectors
  //   let selectedSec =  data?.target?.sectors_multiselect?.value.split(",");
  //   let sec_obj = filterAttr?.sectors?.map((e:any)=>{
  //     return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
  //   })
  //   let sec_save_obj = selectedSec.map((e:any)=>{
  //       return  sec_obj.filter((ele:any)=> {
  //       return  ele.label === e})
  //   })
  //   let final_sec_save_obj = sec_save_obj.map((ele:any)=>{
  //     return ele.length > 0 ? ele[0].value : []
  //   })

  //   //Capablities
  //   let selectedcapab =  data?.target?.capability_multiselect?.value.split(",");
  //   let capab_obj = filterAttr?.capabilities?.map((e:any)=>{
  //     return {"label" : Object.keys(e)[0] , "value" : Object.values(e)[0] } 
  //   })
  //   let capab_save_obj = selectedcapab.map((e:any)=>{
  //       return  capab_obj.filter((ele:any)=> {
  //       return  ele.label === e})
  //   })
  //   let final_capab_save_obj = capab_save_obj.map((ele:any)=>{
  //     return ele.length > 0 ? ele[0].value : []
  //   })



  //   let saveobj = {
  //     "languages":final_lang,
  //     "pronouns": "text",

  //     "practice_areas":  final_pract_save_obj,
  //      "sectors": final_sec_save_obj,
  //      "capabilities":final_capab_save_obj,
  //     "executive_assistant": data?.target?.excutive_assistant?.value,
  //     "full_bio": data?.target?.full_bio?.value,
  //     "life_at_fgs_global":data?.target?.life_at_fgs?.value,
  //     "life_pre_fgs_global": data?.target?.life_pre_fgs?.value,
  //     "life_beyond_fgs_global": data?.target?.life_beyo_fgs?.value
  //   }
    
  //   let config = {
  //     method: "put",
  //     maxBodyLength: Infinity,
  //   url: `${url}profiles/dan.stone@fgsglobal.com`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": `${newToken}`
 
  //     },
  //     data: saveobj
  //   };
 
  //   axios
  //     .request(config)
  //     .then((response) => {
  //     //  console.log(JSON.stringify(response.data));
  //       handleUserDetails();
  //       setShowSuccessAlert(true);
  //       setTimeout(()=>{
  //         setShowSuccessAlert(false);
  //       },3000)
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //   console.log("Final Save Data Payload",saveobj);
  // };

  // const handlePractceAreachnge =(e:any) =>{
  //   setSelctedPractice(e.target.value);
  // }




  return <>
<div className="edit-profile-page-div">
{!loader ? (
<form onSubmit={handleSaveSubmit} className="edit-profile-main-form">
   
   {/* <div className="section-div-basic" style={{ display: 'flex', flexWrap: 'wrap' }} > */}
  
     {/* Start Basic details Form  */}
     <div className="section-div-basic" style={{ width: "100%", display: 'flex', flexWrap: 'wrap' }}>
      
     <div className="sub-sestion-basic" style={{ width: "30%", float: "left" }}>
     {/* <Controller
                control={control}
                defaultValue={'he'}
                name="field_name_product"
                render={({ onChange, value, name, ref }) => (
                    <Select
                        inputRef={ref}
                        classNamePrefix="addl-class"
                        options={options}
                        value={options.find(c => c.value === value)}
                        onChange={val => onChange(val.value)}
                    />
                )}
            /> */}
     </div>
     <div className="edit-profile-main-sestion-basic" style={{ width: "70%", float: "left", display: 'flex',  flexWrap: 'wrap' }}>
 
     <div className="edit-profile-element-div" style={{ width: "50%", float: "left",  }}>
         <label  className="edit-profile-lable">First Name</label>
         <input disabled
          style={{marginLeft: -6}}
           type="text"
           defaultValue={user?.firstName}
           readOnly
           className="edit-profile-text-input"
          {...register("first_name", { required: false, maxLength: 80 })} />
         {errors.first_name && (
           <p className="edit-profile-error">First Name is required</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "50%", float: "left" }}>
         <label   className="edit-profile-lable">Last Name</label>
         <input disabled
           type="text"
           defaultValue={user?.lastName}
           readOnly
           className="edit-profile-text-input"
           {...register("last_name", { required: false, maxLength: 80 })} />
         {errors.last_name && (
           <p className="edit-profile-error">Last Name is required</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label  className="edit-profile-lable"
           >
           HR Title
         </label>
         <input disabled
           type="text"
           className="edit-profile-text-input"
           {...register("hr_title", { required: false })} />
         {errors.hr_title && (
           <p className="edit-profile-error">HR Title is required</p>
         )}

       </div>

       <div className="edit-profile-element-div" style={{ width: "50%", float: "left" }}>
         <label   className="edit-profile-lable"
           >
           Work Location
         </label>
         <input disabled
          style={{marginLeft:-6}}
           type="text"
           className="edit-profile-text-input"
         
           {...register("work_location", { required: false })} />
         {errors.work_location && (
           <p className="edit-profile-error">Work Location is required</p>
         )}

       </div>

       <div className="edit-profile-element-div" style={{ width: "50%", float: "left" }}>
         <label  className="edit-profile-lable" >Work Anniversary</label>
         <input disabled
           type="text"
           className="edit-profile-text-input"
         
           {...register("work_anniversary", { required: false, maxLength: 80 })}
         />
         {errors.work_anniversary && (
           <p className="edit-profile-error">work anniversary is required</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label   className="edit-profile-lable" >Email</label>
         <input disabled
          style={{marginLeft:-6}}
           type="email"
           className="edit-profile-text-input"
         
           {...register("email", { required: false, pattern: /^\S+@\S+$/i })}
         />
         {errors.email && (
           <p className="edit-profile-error">Email is required and must be valid</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "50%", float: "left" }}>
         <label   className="edit-profile-lable" >Internal Phone Number</label>
         <input  disabled
          style={{marginLeft:-6}}
           type="text"
           className="edit-profile-text-input"
         
           {...register("internal_phone_number", { required: false, maxLength: 80 })} />
         {errors.internal_phone_number && (
           <p className="edit-profile-error">Phone Number is required and must be valid</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "50%", float: "left" }}>
         <label className="edit-profile-lable" >External Phone Number</label>
         <input disabled
           type="text"
           className="edit-profile-text-input"
         
           {...register("external_phone_number", { required: false, maxLength: 80 })} />
         {errors.external_phone_number && (
           <p className="edit-profile-error">External Phone Number is required and must be valid</p>
         )}
       </div>


     </div>
     </div>

       
     {/*End Basic details Form  */}
     
     {/* Start Advance details form */}
     <div className="section-div-advance" style={{ width: "100%", display: 'flex', flexWrap: 'wrap' }}>
      
     <div className="sub-sestion-advance" style={{ width: "30%", float: "left" }}>
      
     </div>
     <div className="edit-profile-main-sestion-advance" style={{ width: "70%", float: "left", display: 'flex',  flexWrap: 'wrap' }}>
 


       <div className="edit-profile-element-div" style={{ width: "20%", float: "left" }}>
         <label className="edit-profile-lable"
           >
           Pronouns
         </label>

      

{singledataupdate && <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
           style={{ width: "80%", fontSize: "15px",marginTop:20 }}
           {...register("pronouns", { required: false })}
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          className="single-pronouns-select"
          value={pronounsSelect}
          // value={filterAttr?.storyblokResolves?.pronouns}

          onChange={handleChangePronouns}
        >
          <MenuItem value={""}>Select</MenuItem>
          <MenuItem value={"He/Him"}>He/Him</MenuItem>
          <MenuItem value={"She/Her"}>She/Her</MenuItem>
          <MenuItem value={"They/Them"}>They/Them</MenuItem>
        </Select>
      </FormControl>}

         {errors.pronouns && (
           <p className="edit-profile-error">Please select practice area</p>
         )}
       </div>
          
       <div className="edit-profile-element-div" style={{ width: "80%", float: "left" }}>
         <label className="edit-profile-lable"
           >
           Language
         </label>

         {singledataupdate && <LanguageDropdown  filteAttr={filterAttr} languagedefault={singleProfiledata} languageRef={register("languages")}></LanguageDropdown>}


         {/* <select 
          style={{ width: "100%", fontSize: " 15px" }}
          {...register("language", { required: true })}
          className={`form-control ${errors.pronouns ? 'is-invalid' : ''}`}>
            <option value="select">Select</option>
          <option value="english">English</option>
          <option value="hindi">Hindi</option>

        </select> */}
         {errors.language && (
           <p className="edit-profile-error">Language is required</p>
         )}
       </div>

       <div   className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label className="edit-profile-lable"
           >
           Practice area
         </label>
         
         {/* practiceRef={register("practice_ddmui")} */}
         {singledataupdate && <PracticeAreaDropDown  filteAttr={filterAttr} practisedefault={singleProfiledata} handlePracticeSelected={handlePractice} practiceRef={register("practise_areas")}></PracticeAreaDropDown>}

         {/* <Controller
           control={control}
           name="practice_area"
           rules={{ required: true }}
           render={({ field: { value, onChange } }) => (
             <Multiselect
             className="edit-profile-multi-select"
               options={practice_area}
               isObject={false}
               showCheckbox={true}
               hidePlaceholder={true}
               closeOnSelect={false}
               onSelect={onChange}
               onRemove={onChange}
               selectedValues={value}
             />
           )}
         /> */}
         {errors.practice_area && (
           <p className="edit-profile-error">Please select practice area</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label   className="edit-profile-lable"
           >
           Sectors
         </label>

         
         {singledataupdate && <SectorsDropDown  filteAttr={filterAttr}  practisedefault={singleProfiledata} handleSectorSelected={handleSectors} sectorsref ={register("sectors", { required: false })} ></SectorsDropDown>}


         {/* <Controller
           control={control}
           name="sectors"
           rules={{ required: true }}
           render={({ field: { value, onChange } }) => (
             <Multiselect
             className="edit-profile-multi-select"
               options={sectors}
               isObject={false}
               showCheckbox={true}
               hidePlaceholder={true}
               closeOnSelect={false}
               onSelect={onChange}
               onRemove={onChange}
               selectedValues={value}
             />
           )}
         /> */}
         {errors.sectors && (
           <p className="edit-profile-error">Please select sector</p>
         )}

       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label  style={{marginBottom:6}} className="edit-profile-lable"
           >
           Capabilities
         </label>

         {singledataupdate && <CapabilitiesDropdown filteAttr={filterAttr} practisedefault={singleProfiledata} handleSelectedCapability={handleCapability} capabilityref = {register("capability", { required: false })} ></CapabilitiesDropdown>}
   

         {/* <Controller
           control={control}
           name="capabilities"
           rules={{ required: true }}
           render={({ field: { value, onChange } }) => (
             <Multiselect
               className="edit-profile-multi-select"
               options={capabilities}
               isObject={false}
               showCheckbox={true}
               hidePlaceholder={true}
               closeOnSelect={false}
               onSelect={onChange}
               onRemove={onChange}
               selectedValues={value}
             />
           )}
         /> */}
         {errors.capabilities && (
           <p className="edit-profile-error">Please select capabilities</p>
         )}

       </div>
       </div>
       </div>

     {/* End Advance details form */}

     {/* Start Discription Form */}
     <div className="section-div-discrption" style={{ width: "100%", display: 'flex', flexWrap: 'wrap' }}>
      
      <div className="sub-sestion-discrption" style={{ width: "30%", float: "left" }}>
       
      </div>
      <div className="edit-profile-main-sestion-discrption" style={{ width: "70%", float: "left", display: 'flex',  flexWrap: 'wrap' }}>
  

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label   className="edit-profile-lable"
           >
           Life at FGS Global
         </label>
         <textarea
          defaultValue={singleProfiledata?.storyblokResolves?.life_at_fgs_global}
         style={{marginLeft:-6,height:75,borderBottom: "1px solid"}}
           className="edit-profile-textarea"
           maxLength={totalTextAreaLimit}
           placeholder="Write a short description"
           {...register("life_at_fgs", { required: false ,  onChange: (e) => {setCountLifeAtFgs(e.target.value.length)} })} />
           <p className="edit-profile-textarea-character"> {countLifeAtFgs}/{totalTextAreaLimit} </p>
         {errors.life_at_fgs && (
           <p className="edit-profile-error">Please add comment</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label  className="edit-profile-lable"
           >
           Life Beyond FGS Global
         </label>
         <textarea
          defaultValue={singleProfiledata?.storyblokResolves?.life_beyond_fgs_global}
         style={{marginLeft:-6,height:75,borderBottom: "1px solid"}}
           className="edit-profile-textarea"
           placeholder="Write a short description"
           maxLength={totalTextAreaLimit}
           {...register("life_beyo_fgs", { required: false ,  onChange: (e) => {setCountLifeBeyondFgs(e.target.value.length)} })} />
           <p className="edit-profile-textarea-character"> {countLifeBeyondFgs}/{totalTextAreaLimit} </p>
         {errors.life_pre_fgs && (
           <p className="edit-profile-error">Please add comment</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label  className="edit-profile-lable"
           >
           Life Pre FGS Global
         </label>
         <textarea
          defaultValue={singleProfiledata?.storyblokResolves?.life_pre_fgs_global}
         style={{marginLeft:-6,height:75,borderBottom: "1px solid"}}
           className="edit-profile-textarea"
           placeholder="Write a short description"
           maxLength={totalTextAreaLimit}
           {...register("life_pre_fgs", { required: false ,  onChange: (e) => {setCountLifePreFgs(e.target.value.length)} })} />
           <p className="edit-profile-textarea-character"> {countLifePreFgs}/{totalTextAreaLimit} </p>
         {errors.life_pre_fgs && (
           <p className="edit-profile-error">Please add comment</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label   className="edit-profile-lable"
           >
           Full Bio
         </label>
         <textarea
         style={{marginLeft:-6,height:75,borderBottom: "1px solid"}}

         defaultValue={singleProfiledata?.storyblokResolves?.full_bio.replace(/\r?\/n/g, '\n')}
           className="edit-profile-textarea"
           placeholder="Write a short description"
           maxLength={totalTextAreaLimit}
           {...register("full_bio", { required: false ,  onChange: (e) => {setCountFullBio(e.target.value.length)} })} />
           <p className="edit-profile-textarea-character"> {countFullBio}/{totalTextAreaLimit} </p>
         {errors.full_bio && (
           <p className="edit-profile-error">Please add comment</p>
         )}
       </div>

       <div className="edit-profile-element-div" style={{ width: "100%", float: "left" }}>
         <label   className="edit-profile-lable"
           >
           Internal Bio
         </label>
         <textarea
           style={{marginLeft:-6, height:75, borderBottom: "1px solid"}}
           className="edit-profile-textarea"
           placeholder="Write a short description"
           maxLength={totalTextAreaLimit}
           {...register("internal_bio", { required: false ,  onChange: (e) => {setCountInternalBio(e.target.value.length)} })} />
           <p className="edit-profile-textarea-character"> {countInternalBio}/{totalTextAreaLimit} </p>
         {errors.internal_bio && (
           <p className="edit-profile-error">Please add comment</p>
         )}
       </div>
     
       <div className="edit-profile-element-div" style={{ width: "30%", float: "left" }}>
         <label  className="edit-profile-lable"
            >
           Execitive Assistant
         </label>
         {/* <Controller
           control={control}
           name="executive_assistant"
           rules={{ required: true }}
           render={({ field: { value, onChange } }) => (
             <Multiselect
               className="edit-profile-single-select"
               options={list_executive}
               isObject={false}
               showCheckbox={true}
               hidePlaceholder={true}
               closeOnSelect={false}
               onSelect={onChange}
               onRemove={onChange}
               selectedValues={value}
               singleSelect={true}

             />
           )}
         /> */}
         <input  
         defaultValue={singleProfiledata?.storyblokData?.content?.executive_assistant}
          {...register("excutive_assistant", { required: false })}
         style={{marginLeft:-6}} type="text" placeholder="Enter a name"></input>
         {errors.executive_assistant && (
           <p className="edit-profile-error">Please select Executive assistance</p>
         )}
       </div>
       </div>
       </div>
     {/* End Discription Form */} 
   {/* </div> */}



   <div className="edit-prfile-form-buttom" style={{ width: "100%", display: 'flex', flexWrap: 'wrap' }}>
{/*       
      <div className="edit-profile-button-empty-div" style={{ width: "30%", float: "left" }}>
       
      </div>
      <div className="edit-profile-button-div" style={{ width: "70%", float: "left", display: 'flex',  flexWrap: 'wrap' }}>
   */}
    
   <div className="edit-profile-button-div" style={{ width: "50%", float: "left" }}>
   <button className="edit-profile-submit-button" type="submit" style={{ margin: "10px" }}>
     Save
   </button>
   {showSuccesAlert && <Alert sx={{mb:6}} variant="filled" severity="success">
     Profile updated sucessfully.
   </Alert>}
   {showFailAlert && <Alert sx={{mb:6}} variant="filled" severity="error">
     Failed to update the profile
   </Alert>}
   
   </div>
   <div className="edit-profile-button-div" style={{ width: "50%", float: "left" }}>
   <button className="edit-profile-reset-button" type="button" style={{ margin: "10px" }}>
     Cancel
   </button>
   </div>
   </div>


   {/* </div> */}
 </form>) :
  (
    "loading ...."
  )}
 </div>

  </>
};



