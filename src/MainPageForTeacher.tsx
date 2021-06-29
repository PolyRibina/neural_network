import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {ButtonGroup, Container, TextField} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import React, {Dispatch, SetStateAction} from "react";
import Api from "./Api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);
interface StandardComponentProps{
    sections: string[]
    setSections: Dispatch<SetStateAction<never[]>>
    themes: string[]
    setThemes: Dispatch<SetStateAction<never[]>>
    handleClicks: () => void
}

export default function MainPageForTeacher({sections, setSections, themes, setThemes, handleClicks}: StandardComponentProps) {
    const classes = useStyles();

    document.addEventListener("DOMContentLoaded", ()=> {
        Api.getSections().then((data)=>{
            setSections(data);
            console.log(sections);
        })
    })
    return (
        <Container component="main" maxWidth="lg">
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} sm={3}>
                            <Paper className={classes.paper}>
                                <div>
                                    <img src={logoMainPage} alt={"cannot display"} style={{height: "10vh", marginLeft: "3vh"}}/>
                                </div>
                                <Button variant="outlined" color="primary" onClick={handleClicks}>
                                    Выйти из режима преподавателя
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper } style={{height: "20vh"}}>xs=12</Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={true} sections={sections} themes={themes} setThemes={setThemes} setSections={setSections}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper className={classes.paper}>
                        <TextField
                            label="Текст лекции"
                            style={{width: "100%", height: "100%"}}
                            multiline
                            rows={29}
                            defaultValue=""
                            variant="outlined"
                        />
                        <ButtonGroup
                            orientation="vertical"
                            color="primary"
                            aria-label="vertical outlined primary button group"
                            style={{marginRight: '850px'}}
                        >
                            <Button>One</Button>
                            <Button>Two</Button>
                            <Button>Three</Button>
                            <Button>Four</Button>
                        </ButtonGroup>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}