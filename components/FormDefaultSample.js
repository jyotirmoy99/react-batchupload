
import React, { Component, useEffect } from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";


const TestComponent = (props) => {

  const [fields, setFields] = React.useState({})
  const [errors, setErrors] = React.useState({})
  const gqlMutation = createMutation();
  const [createPost, { data:returnData, loading, error:submitError }] = useMutation(gqlMutation);
  const addPost = () => {
    createPost({
      variables: {
        input: fields
      },
    });
  };
  function createMutation(){
      let code=`
      mutation createPost(
        $input: CreatePostInput!
      ) {
        createPost(input: $input) {
        id
        title
        body
      }
      }`;
      let mutationCode= gql`
      ${code}
    `;
    return mutationCode;
  }
  useEffect(() => {
    if (loading) {
      console.log("loading data");
    }
  }, [loading]);
  useEffect(() => {
    console.log(returnData);
    if (returnData) {
      alert("Post created with id "+returnData.createPost.id);
    }
  }, [returnData]);
  useEffect(() => {
    if (submitError) {
      console.log(submitError);
    }
  }, [submitError]);


  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    if (!fields["title"]) {
      formIsValid = false;
      errors["title"] = "Country Name cannot be empty";
    }
    setErrors(errors)
    return formIsValid;
  }

  const handleChange = (field, e) => {
    let fieldsT = fields;
    fieldsT[field] = e.target.value;
    setFields(fieldsT);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handleValidation()) {
      addPost();
    }
  }

  return (
    <div style={{ margin: '20%', marginTop: '5%', height: 900 }}>
      <form>
        <Grid container spacing={3}>

          <Grid item xs={12} >
            <TextField
              id='A1A8BAE5-D205-4F1B-A14A-F48CDCB0D052'
              label='Title'
              type='text'
              value={fields.title}
              onChange={(e) => { handleChange("title", e) }}
              InputProps={{
                readOnly: false,
              }}
            /><div style={{ color: "red" }}>{errors["title"]}</div></Grid>
          <Grid item xs={12} >
            <TextField
              id='A1A8BAE5-D205-4F1B-A14A-F48CDCB0D052ds'
              label='Body'
              type='text'
              value={fields.body}
              onChange={(e) => { handleChange("body", e) }}
              InputProps={{
                readOnly: false,
              }}
            /><div style={{ color: "red" }}>{errors["body"]}</div></Grid>

          <Grid item xs={12} >
            <Button color="primary" variant="contained" disabled={loading} onClick={(e) => { handleSubmit(e) }}
              id='A4C36766-2C87-45B0-8AB7-C945507FCEF2' >Save</Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

}

export default TestComponent;