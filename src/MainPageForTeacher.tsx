import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {
    Box,
    ButtonGroup,
    Container,
    Dialog, DialogActions,
    DialogContent, DialogContentText,
    TextField, Typography
} from "@material-ui/core";
import logoMainPage from './logoMainPage.png';
import TableOfContents from "./TableOfContents";
import Button from '@material-ui/core/Button';
import React, {Dispatch, SetStateAction} from "react";
import LiveHelpIcon from '@material-ui/icons/LiveHelp';
import LinearProgress, { LinearProgressProps } from '@material-ui/core/LinearProgress';
import PopupState from "material-ui-popup-state";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Api from "./Api";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        root: {
            height: 180,
        },
        wrapper: {
            width: 100 + theme.spacing(2),
        },
        svg: {
            width: 100,
            height: 100,
        },
        polygon: {
            fill: theme.palette.common.white,
            stroke: theme.palette.divider,
            strokeWidth: 1,
        },
    }),
);
interface StandardComponentProps{
    chooseTheme: string
    setChooseTheme: Dispatch<SetStateAction<string>>
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
    setSections: Dispatch<SetStateAction<never[]>>
    sectionsHelp: any[]
    map2: Map<string, string[]>
    mapContent: Map<string[], string[]>
    handleClicks: () => void
    sections: any[]
    chooseSection: string
    setChooseSection: Dispatch<SetStateAction<string>>
}

let currentPrompt: string;
let listArray: string[]=[];

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

export default function MainPageForTeacher({map2, handleClicks, sections, setSections, sectionsHelp, prompts, setPrompts, chooseTheme, setChooseTheme, mapContent, chooseSection, setChooseSection}: StandardComponentProps) {

    const classes = useStyles();
    const [openAddPrompt, setOpenAddPrompt] = React.useState(false);
    const [promptText, setPromptText] = React.useState("");

    const [text, setText] = React.useState('');
    const [code, setCode] = React.useState('');

    const helpButtonClick = () => {
        setOpenAddPrompt(true);
    };

    const addPromptClose = () => {
        setPromptText('');
        setOpenAddPrompt(false);
    };

    const addPromptSave = () => {
        currentPrompt = promptText;
        setPromptText('');
        addPromptClose();
    };

    const mapToObj = (inputMap: Map<string[], string[]>) => {
        let obj = {};
        inputMap.forEach((value: string[], key: string[]) => {
            // @ts-ignore
            obj[key] = value
        });

        return obj;
    }

    const saveList = () => {
        listArray.push(listArray.length.toString());
        mapContent.set([chooseSection, chooseTheme, listArray[listArray.length-1]], [text, code, currentPrompt]);
        console.log(mapContent);

        setText('');
        setCode('');
    };

    const saveTheme = () => {
        saveList();
        Api.setContent("content", JSON.stringify(mapToObj(mapContent))).then(() => {
            console.log("success set list");
        })
        setChooseTheme('');
    };

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
                            <Paper className={classes.paper} style={{height: "20vh"}}>xs=12</Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Paper className={classes.paper}>
                        <TableOfContents isTeacher={true} prompts={prompts} map2={map2} sections={sections} setSections={setSections} sectionsHelp={sectionsHelp} setPrompts={setPrompts} chooseTheme={chooseTheme} setChooseTheme={setChooseTheme} chooseSection={chooseSection} setChooseSection={setChooseSection} chooseSectionTheme={()=>{}}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9} style={{display: chooseTheme !== ""? "inline":"none"}}>
                    <Paper className={classes.paper}>
                        <LinearProgressWithLabel value={50} />
                        <TextField
                            label="Текст лекции"
                            style={{width: "100%", height: "100%", marginBottom: "0.95vh"}}
                            multiline
                            rows={20}
                            defaultValue=""
                            value={text}
                            variant="outlined"
                            onChange={e =>{setText(e.target.value)}}
                        />
                        <Grid container spacing={10}>
                            <Grid item xs={12} sm={1}>
                                <PopupState variant="popover" popupId="demo-popup-menu">
                                    {(popupState) => (
                                        <React.Fragment>
                                            <Button
                                                color="primary"
                                                aria-label="vertical outlined primary button group"
                                                style={{marginRight: '850px', border: "1px solid"}}
                                                onClick={helpButtonClick}><LiveHelpIcon/>

                                            </Button>
                                            <Dialog open={openAddPrompt} onClose={addPromptClose} aria-labelledby="form-dialog-title">
                                                <DialogContent style={{width: '500px'}}>
                                                    <DialogContentText>
                                                        Введите текст подсказки
                                                    </DialogContentText>
                                                    <TextField
                                                        autoFocus
                                                        margin="dense"
                                                        label="Подсказка"
                                                        multiline
                                                        rows={10}
                                                        fullWidth
                                                        defaultValue=''
                                                        value={promptText}
                                                        onChange={e =>{setPromptText(e.target.value)}}
                                                    />
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button onClick={addPromptClose} color="primary">
                                                        Отменить
                                                    </Button>
                                                    <Button onClick={addPromptSave} color="primary">
                                                        Сохранить
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </React.Fragment>
                                    )}
                                </PopupState>
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
                                    onChange={e =>{setCode(e.target.value)}}
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
                            <Button onClick={saveList}>
                                <ArrowForwardIcon/>
                            </Button>
                            <Button onClick={saveTheme}>Сохранить тему</Button>
                        </ButtonGroup>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={9} style={{display: chooseTheme === ""? "inline":"none"}}>
                    <Paper className={classes.paper}>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}