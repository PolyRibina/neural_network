import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import React, {Dispatch, SetStateAction, useState} from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Box,
    ButtonGroup,
    Container,
    TextField, Typography
} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import AuthPage from "./AuthPage";
import Api from "./Api";
import Hello1 from "./Приветствие.png";
import Hello2 from "./Приветствие2.png";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import LinearProgress, {LinearProgressProps} from "@material-ui/core/LinearProgress";

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
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
}

let map2 = new Map()
let mapContentHelp = new Map()
let sectionsHelp: any[] = []
let mapContent = new Map<string[], string[]>() // <[раздел, тема, страница], [текст, код, подсказки]>

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function MainPage({prompts, setPrompts}: StandardComponentProps) {
    const [chooseTheme, setChooseTheme] = React.useState('');
    const [chooseSection, setChooseSection] = React.useState('');
    const classes = useStyles();
    const [auth, setAuth] = useState(false);
    const [sections, setSections] = useState([]);
    const [helloPic, setHelloPic] = useState(false);

    const [text, setText] = useState('');
    const [code, setCode] = useState('');

    const handleClick = () => {
        setAuth(!auth);
        setChooseSection("");
        setChooseTheme("");
    };

    const chooseSectionTheme = (theme: string) => {
        console.log(mapContentHelp)
        let key = chooseSection +"," + theme + ",0";
        console.log(key);
        console.log(mapContentHelp.get(key));
        if(mapContentHelp.has(key)){
            setText(mapContentHelp.get(key)[0]);
        }
        if(mapContentHelp.has(key)){
            setCode(mapContentHelp.get(key)[1]);
        }
    };

    window.onload=()=>{
        console.log("задаем map")
        Api.getContent("menu").then((data)=>{
            console.log(data);
            map2 = new Map(Object.entries(data));
            console.log(map2);
            map2.forEach((value:string[], key: string)=>{
                sectionsHelp = [...sectionsHelp, [key, value]];
                // @ts-ignore
                setSections(sectionsHelp);
                console.log("меню", sectionsHelp);
            });
        })
        Api.getContent("content").then((data)=>{
            console.log("лекции", data);
            mapContentHelp = new Map(Object.entries(data));
            console.log("лекции", mapContentHelp);
        })
    }
    if (!auth)
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
                                <Button variant="outlined" color="primary" onClick={handleClick}>
                                    Авторизоваться как преподаватель
                                </Button>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={9}>
                            <Paper className={classes.paper} style={{height: "16.6vh"}}>
                                {
                                    chooseSection
                                }
                                |
                                {
                                    chooseTheme
                                }
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={false} prompts={prompts} setPrompts={setPrompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} chooseSection={chooseSection} setChooseSection={setChooseSection} chooseSectionTheme={chooseSectionTheme}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9}>
                    <Paper className={classes.paper} style={{height: "71.8vh"}}>
                        <div style={{display: chooseTheme === ""? "inline":"none"}}>
                            <img src={Hello1} onClick={()=> setHelloPic(true)} alt={"cannot display"} style={{marginTop: "20vh", display: !helloPic? "inline":"none"}}/>
                            <img src={Hello2} onClick={()=> setHelloPic(false)} alt={"cannot display"} style={{marginTop: "20vh", display: helloPic? "inline":"none"}}/>
                        </div>
                        <div style={{display: chooseTheme !== ""? "inline":"none"}}>
                            <LinearProgressWithLabel value={50} />
                            <p>{text}</p>
                            <Grid container spacing={10}>
                                <Grid item xs={12} sm={1}>
                                    <ButtonGroup
                                        orientation="vertical"
                                        color="primary"
                                        aria-label="vertical outlined primary button group"
                                    >
                                        <Button>ONE</Button>
                                        <Button>TWO</Button>
                                        <Button>THREE</Button>
                                    </ButtonGroup>
                                </Grid>
                                <Grid item xs={12} sm={11}>
                                    <TextField
                                        label="Код"
                                        style={{width: "100%"}}
                                        multiline
                                        rows={10}
                                        defaultValue=''
                                        value={code}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                            <ButtonGroup
                                orientation="horizontal"
                                color="primary"
                                aria-label="vertical outlined primary button group"
                                style={{marginLeft: '63.3vh', marginTop: '2.1vh'}}
                            >
                                <Button><ArrowBackIcon/></Button>
                                <Button><ArrowForwardIcon/></Button>
                            </ButtonGroup>
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
    else{
        return (
            <AuthPage prompts={prompts} setPrompts={setPrompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} handleClick={handleClick} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} mapContent={mapContent} chooseSection={chooseSection} setChooseSection={setChooseSection}/>
        );
    }
}