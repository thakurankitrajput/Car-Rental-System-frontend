import MaterialTable from "@material-table/core";
import { useState,useEffect } from "react"
import { getData,postData,ServerURL} from "../../Services/FetchNodeServices";
import { Avatar,Button,TextField,Grid,styled} from "@material-ui/core";
import { useStyles } from "./DisplayAllModelCss";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from "sweetalert2";
import { upload } from "@testing-library/user-event/dist/upload";
import {  useNavigate } from "react-router-dom";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DisplayAllModel(props){
  var classes=useStyles()
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  var navigate=useNavigate()
  
   var [icon,setIcon]=useState({filename:'/assets/defaultcar.png',bytes:''})
    var [prevIcon,setPrevIcon]=useState('')
    var [oldIcon,setOldIcon]=useState('')
    var [model,setModel]=useState([])
    var [modelID,setModelID]=useState('')
    var [modelName,setModelName]=useState('')
    var [year,setYear]=useState('')
    var [companyList,setCompanyList]=useState([])
    var [companyID,setCompanyID]=useState('')
    var [companyName,setCompanyName]=useState([])
   var [subcategoryName,setSubCategoryName]=useState('')
   var [categoryName,setCategoryName]=useState('')
   var [categoryID,setCategoryID]=useState('')
   var [categoryList,setCategoryList]=useState([])
    var [subcategoryID,setSubCategoryID]=useState('')
    const [subCategoryList,setSubCategoryList]=useState([])
    var [buttonStatus,setButtonStatus]=useState({upload:true})          //buttonStatus is made for upload/save/discard buttons.
                                                                        // agr buttonStatus me false hoga toh uplaod button show ni hoga button pr click rne pr.otherwise show hoga.
   const [open,setOpen]=useState(false)  //setOpen is made for opening and closing functionality of anything.

   const fetchAllModel=async()=>{
    var result=await getData('model/display_all_model')
    setModel(result.data)
   }
   const fetchAllCompany=async()=>{
    var result=await getData('company/display_all_company')
    setCompanyList(result.data)
   }
   const fetchAllCategory=async()=>{
    var result=await getData('category/display_all_category')
    setCategoryList(result.data)
   }
   const fetchAllSubCategory=async()=>{
    var result=await getData('subcategory/display_all_subcategory')
    setSubCategoryList(result.data)
   }
  
   useEffect(function(){            //useEffect is for page rendering or state change
    
    fetchAllModel()
   },[])


   
   const fillCategoryDropDown=()=>{
    return categoryList.map((item)=>{         //categoryList.map  array bnake dega or array json me hoga.
    return(                                  //ye wla return is for jo new array return hoke ayga 
        <MenuItem value={item.categoryid}>{item.categoryname}</MenuItem> 
     )
    })
   } 

   const fetchAllSubCategoryByCategory=async(category_id)=>{
    var body={categoryid:category_id}
    var response=await postData('subcategory/fetch_all_subcategory_by_category',body);
    setSubCategoryList(response.result)
   }
   const fillSubCategoryDropDown=()=>{
    return subCategoryList.map((item)=>{
        return(
            <MenuItem value={item.subcategoryid}>{item.subcategoryname}</MenuItem>
        )
    })
    }  
    const fetchAllCompanyBySubCategory=async(subcategory_id)=>{
        var body={subcategoryid:subcategory_id}
        var response=await postData('subcategory/fetch_all_company_by_subcategory',body);
        setCompanyList(response.results)
       }
       const fillCompanyDropDown=()=>{
        return companyList.map((item)=>{
            return(
                <MenuItem value={item.companyid}>{item.companyname}</MenuItem>
            )
        })
    }  
   
  const handleChange=(event)=>{
    setCategoryID(event.target.value)
    fetchAllSubCategoryByCategory(event.target.value)
  }
  const handleSubCategoryChange=(event)=>{
    setSubCategoryID(event.target.value)
    fetchAllCompanyBySubCategory(event.target.value)
    }
    const handleCompanyChange=(event)=>{
        setCompanyID(event.target.value)
    }
    

   const handleSetDataForDialog=(rowData)=>{
    fetchAllSubCategory()
    fetchAllCategory()
    fetchAllModel()
    fetchAllCompany()
    setYear(rowData.year)
    setModelID(rowData.modelid)
    setModelName(rowData.modelname)
    setCompanyID(rowData.companyid)
    setCompanyName(rowData.companyname)
    setCategoryID(rowData.categoryid)
    setCategoryName(rowData.categoryname)
    setSubCategoryID(rowData.subcategoryid)
    setSubCategoryName(rowData.subcategoryname)
    setOldIcon(rowData.icon)
    setIcon({filename:`${ServerURL}/images/${rowData.icon}`,bytes:''})
    setPrevIcon(`${ServerURL}/images/${rowData.icon}`)
    setOpen(true)   //true in setOpen fn is for opening of any button in the page.
   }

   const handleDiscard=()=>{
    setIcon({filename:prevIcon,bytes:''})
    setButtonStatus({upload:true})
   }

   const handleSavePicture=async()=>{
    var formData=new FormData()        //formData ka use kebal picture ke liye use kiya jata h.
    formData.append('modelid',modelID)
    
    formData.append('oldicon',oldIcon)
    formData.append('icon',icon.bytes)
    var response=await postData('model/edit_picture',formData)
    if(response.status)
    {
    Swal.fire({
        icon: "success",
        title: "Done",
        text: "Icon updated  successfully",
        
      });
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            });
    }
    setButtonStatus({upload:true})  //for showing upload button again after clicking save/discard button.
    setOpen(false)      //inside setOpen fn false is for closing after clicking discard button in dialog.
    fetchAllModel()   //for  automatically refreshing the page just after updating the picture.
   }


   const handleEditData=async()=>{
    var body={modelid:modelID,modelname:modelName,companyid:companyID,companyname:companyName,categoryid:categoryID,categoryname:categoryName,subcategoryname:subcategoryName,subcategoryid:subcategoryID}
    var response=await postData('model/edit_data',body)
    if(response.status)
    {
    Swal.fire({
        icon: "success",
        title: "Done",
        text: "Model updated successfully",
        
      });
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            });
    }
    setOpen(false)      //inside setOpen fn false is for closing after clicking discard button in dialog.
    fetchAllModel()   //for  automatically refreshing the page just after updating the picture.
   }


   const handleDelete=async()=>{
    var body={modelid:modelID,modelname:modelName,companyid:companyID,subcategoryid:subcategoryID,categoryid:categoryID,oldicon:oldIcon}
    var response=await postData('model/delete_data',body)
    if(response.status)
    {
    Swal.fire({
        icon: "success",
        title: "Done",
        text: "Model deleted  successfully",
        
      });
    }
    else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            });
    }
    setOpen(false)      //inside setOpen fn false is for closing after clicking discard button in dialog.
    fetchAllModel()   //for  automatically refreshing the page just after updating the picture.
   }




   const showHidePictureButtons=()=>{
    return(<div>
          {buttonStatus.upload?<><Button fullWidth
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              >Upload 
        
              <VisuallyHiddenInput onChange={handlePicture} type="file" />
              </Button></>:<><Button onClick={handleSavePicture} color="primary">Save</Button><Button onClick={handleDiscard}  color="secondary">Discard</Button></>}
    </div>)
   }

  


    function displayCompanies() {
        return (
          <MaterialTable
            title="List of Model"
            columns={[
                { title: 'Model Id', field: 'modelid' }, 
              { title: 'Category', field: 'categoryid' },
              { title: 'SubCategory', field: 'subcategoryid' },
              { title: 'Company', field: 'companyid'},
              { title: 'ModelName', field: 'modelname' },
              { title: 'Year', field: 'year' },
              { title: 'Icon', field: 'icon', render:(rowData)=><Avatar src={`${ServerURL}/images/${rowData.icon}`} style={{width:50,height:40}} variant="rounded" />},
            ]}
            data={model}        
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit Company',
                onClick: (event, rowData) => handleSetDataForDialog(rowData)
              },
              {
                icon: 'add',
                tooltip: 'Add Model',
                isFreeAction: true,
                onClick: (event) => navigate('/dashboard/model')
              }
            ]}
          />
        )
      }

      const handleClose=()=>{
        setOpen(false)
      }


      const handlePicture=(event)=>{
        setIcon({filename:URL.createObjectURL(event.target.files[0]),bytes:event.target.files[0]})
        setButtonStatus(true)
      }

      const showDialog=()=>{
        return(
          <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       
        <DialogContent>
        
        <div className={classes.box}>
        <Grid container spacing={2}>
            <Grid item xs={12} className={classes.headingStyle}>
                Model Interface

            </Grid>
            <Grid item xs={4}>
            <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select Category</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                           id="demo-simple-select"
                           value={categoryID}
                           label="Select Category"
                           onChange={handleChange}
                          >
                            {fillCategoryDropDown()}
                        </Select>
                      </FormControl>
            </Grid>
            <Grid item xs={4}>
            <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select SubCategory</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                           id="demo-simple-select"
                           value={subcategoryID}
                           label="Sub Category"
                           onChange={handleSubCategoryChange}
                          >
                            {fillSubCategoryDropDown()}
                        </Select>
                      </FormControl>
            </Grid>
             
            <Grid item xs={4}>
            <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Select Company</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                           id="demo-simple-select"
                           value={companyID}
                           label="Company"
                           onChange={handleCompanyChange}
                          >
                            {fillCompanyDropDown()}
                        </Select>
                      </FormControl>
            </Grid>
            
            <Grid item xs={6}>
               <TextField value={modelName} onChange={(event)=>setModelName(event.target.value)}  label="Model Name" fullWidth/>
            </Grid>
            <Grid item xs={6}>
               <TextField value={year} onChange={(event)=>setYear(event.target.value)}  label="Year" fullWidth/>
            </Grid>

            <Grid item xs={6}>
            {showHidePictureButtons()}
            </Grid>
          

            <Grid item xs={6} className={classes.center}>
            <Avatar
             alt="Category Icon"
             src={icon.filename}
             variant="rounded"
             sx={{ width: 120, height: 56 }}
            />
            </Grid>

            <Grid item xs={6}>
                <Button onClick={handleEditData} variant="contained" fullWidth>
                    Edit Data
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button onClick={handleDelete} variant="contained" fullWidth>
                    Delete
                </Button>
            </Grid>


        </Grid>
        </div>
    
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      </div>
        )
      }

    return( 
        <div className={classes.dialogContainer}>
          <div className={classes.dialogBox}>

           {displayCompanies()}
           </div>
           {showDialog()}
        </div>
    )

}