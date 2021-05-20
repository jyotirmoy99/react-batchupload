
import React, { useEffect } from 'react';
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import { gql,useMutation,useQuery } from "@apollo/client";
import Router from 'next/router'


import TextField from '@material-ui/core/TextField';
//Components

//Class Designer : 

const home = (props) => {
    
   const [fields,setFields] = React.useState({})
   const [errors,setErrors] = React.useState({})
   const [formError, setFormError] = React.useState("")
   const [dialogOpen, setDialogOpen] = React.useState(false);
   const [formProcessing,setFormProcessing] = React.useState(false)

   const handleDialogClose = () => {
    setDialogOpen(false);
    if(false){
        Router.push('undefined');
    }
    setFormProcessing(false);
  };const [loading,setLoading] = React.useState(false);
    function submitCompleted(data){
        setDialogOpen(true);
    }
    function submitCompleted(data){
        console.log("in submitCompleted");
        setFormProcessing(true);
        setDialogOpen(true);
    }
 
   const handleValidation = (fieldname,e) => {
        let errorsT = errors;
        let formIsValid = true;
        
        setErrors({...errorsT})
       return formIsValid;
   }

   const handleChange = (field, e) => {         
    if(!handleValidation(field,e)){
        e.preventDefault();
        return;
    }
    let fieldsT = fields;
    fieldsT[field] =  e?(e.target ? e.target.value : e):e ;        
    setFields({...fieldsT});
   }

   const toggleChecked = (field,e) => {
       let fieldsT= fields;
       if(fieldsT[field] === "")
        fieldsT[field] = true;
    else
        fieldsT[field] = !fieldsT[field];
    setFields({...fieldsT});
   }

   const handleSubmit = (e) => {
        e.preventDefault();

        if(handleValidation('submitValidateAll')){
             setDialogOpen(true);
        }
    }

        const { classes } = props;
        return (
            <div style={{margin:'20%',marginTop:'5%', height:900}}>
            <form>
                <Grid container spacing={3}>
                    
                <Grid item xs={12} >            
                    <TextField
                    id='name'
                    label='Name'
                    type='text'
                    value={fields.name}
                    onChange={(e) => {handleChange("name",e)}}
                    onBlur={(e) => {handleChange("name",e)}}
                    InputProps={{
                        readOnly: false,
                    }}
                    />
                </Grid> 
                    
                </Grid>
                </form>
            </div>
        );
    
}  
home.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  export default home;
