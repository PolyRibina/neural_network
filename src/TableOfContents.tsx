import React, {Dispatch, SetStateAction} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import {ButtonGroup, DialogActions, Slide} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Dialog } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { DialogContentText } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import Api from "./Api";
import Help1 from "./Help1.png";
import Help2 from "./Help2.png";
import Help3 from "./Help3.png";

let images: any[] = [];
images.push(Help1);
images.push(Help2);
images.push(Help3);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            height: '71vh',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(4),
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

interface StandardComponentProps{
    isTeacher: boolean
    map2: Map<string, string[]>
    chooseTheme: string
    sections: any[]
    sectionsHelp: any[]
    prompts: string[]
    setPrompts: Dispatch<SetStateAction<never[]>>
    setChooseTheme: Dispatch<SetStateAction<string>>
    setSections: Dispatch<SetStateAction<never[]>>
    chooseSection: string
    setChooseSection: Dispatch<SetStateAction<string>>
    chooseSectionTheme: (theme: string) => void
    openHelpSnake: boolean
    setCount: Dispatch<SetStateAction<number>>
    helpCountNull: ()=> void
    openNoneController: ()=> void
}

let menu: string[] = []

export default function TableOfContents({isTeacher, map2, sections, setSections, sectionsHelp, chooseTheme, setChooseTheme, chooseSection, setChooseSection, chooseSectionTheme, openHelpSnake, setCount, helpCountNull, openNoneController}: StandardComponentProps) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const [openAddSection, setOpenAddSection] = React.useState(false);
    const [nameSection, setNameSection] = React.useState('');

    const [openAddTheme, setOpenAddTheme] = React.useState(false);
    const [nameTheme, setNameTheme] = React.useState('');

    const [deleteTheme, setDeleteTheme] = React.useState(false);
    const [textForDelete, setTextForDelete] = React.useState('');


    const handleClick = (section: string) => {
        setChooseSection(section);
        setChooseTheme('');
        setOpen(true);
        openNoneController();
    };

    const addSection = () => {
        setOpenAddSection(true);
    };

    const addSectionClose = () => {
        setNameSection('');
        setOpenAddSection(false);
    };

    const mapToObj = (inputMap: Map<string, string[]>) => {
        let obj = {};
        inputMap.forEach((value: string[], key: string) => {
            // @ts-ignore
            obj[key] = value
        });

        return obj;
    }

    const addSectionSave = () => {
        //sections = [...sections, nameSection];
        map2.set(nameSection, [])

        menu = [...menu, nameSection]; // для отображения

        Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {

            sectionsHelp = []
            Api.getContent("menu").then((data)=>{
                map2 = new Map(Object.entries(data));
                map2.forEach((value:string[], key: string)=>{
                    console.log("мы тут!")
                    sectionsHelp = [...sectionsHelp, [key, value]];
                    // @ts-ignore
                    setSections(sectionsHelp);
                    console.log("меню", sectionsHelp);
                });
            })

        })

        addSectionClose();
    };

    const addTheme = () => {
        setOpenAddTheme(true);
    };

    const addThemeClose = () => {
        setNameTheme('');
        setOpenAddTheme(false);
    };

    const addThemeSave = () => {
        let menuTh = map2.get(chooseSection);
        // @ts-ignore
        if (menuTh === undefined) {
            alert("Сначала выберите раздел!");
            addThemeClose();
            return;
        }
        menuTh = [...menuTh, nameTheme];
        map2.set(chooseSection, menuTh)

        sectionsHelp.forEach((value) => {
            if (value[0] === chooseSection) {
                value[1] = menuTh
            }
        })
        Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {
            console.log("success set theme");

            console.log("sections help",sectionsHelp);
            // @ts-ignore
            setSections(sectionsHelp);
        })

        addThemeClose();
    };

    const deleteThemeOpen = () => {
        if(chooseTheme === "" && chooseSection === ""){
            alert("Сначала выберите тему либо раздел!")
            return
        }
        else if(chooseTheme === "" && chooseSection !== ""){
            setTextForDelete("Вы точно хотите удалить выбранный раздел?")
        }
        else if(chooseTheme !== "" && chooseSection !== ""){
            setTextForDelete("Вы точно хотите удалить выбранную тему?")
        }
        setDeleteTheme(true);
    };

    const deleteThemeClose = () => {
        setDeleteTheme(false);
    };

    const deleteThemeAgree = () => {

        if(chooseTheme !== ""){
            console.log("удаляем тему")
            let menuTh = map2.get(chooseSection);

            // @ts-ignore
            menuTh = menuTh.filter(letsdelete => letsdelete !== chooseTheme);
            map2.set(chooseSection, menuTh)

            sectionsHelp.forEach((value) => {
                if (value[0] === chooseSection) {
                    value[1] = menuTh
                }
            })

            Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {
                // @ts-ignore
                setSections(sectionsHelp);
                setChooseTheme("");
            })


            deleteThemeClose();
        }
        else if(chooseTheme === "" && chooseSection !== ""){
            console.log("удаляем раздел")

            map2.delete(chooseSection);
            console.log(map2);

            Api.setContent("menu", JSON.stringify(mapToObj(map2))).then(() => {

                sectionsHelp = []
                Api.getContent("menu").then((data)=>{
                    map2 = new Map(Object.entries(data));
                    map2.forEach((value:string[], key: string)=>{
                        console.log("мы тут!")
                        sectionsHelp = [...sectionsHelp, [key, value]];
                        // @ts-ignore
                        setSections(sectionsHelp);
                        setChooseSection('');
                        console.log("меню", sectionsHelp);
                    });
                })
            })


            deleteThemeClose();
        }
    };

    return (
        <div>
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                    </ListSubheader>
                }
                className={classes.root}
            >
                <List dense >
                    {sections?.map((section) => {
                        return (
                            <div>
                                <ListItem selected={section[0] === chooseSection} key={section[0]} button
                                          onClick={() => {
                                              handleClick(section[0])
                                          }}>
                                    <ListItemText disableTypography style={{fontFamily: 'Andale Mono, monospace', fontSize: '120%'}} primary={section[0]}/>
                                </ListItem>

                                <Collapse style={{display: section[0] === chooseSection ? 'inline' : 'none'}} in={open}
                                          timeout="auto" unmountOnExit>
                                    <List dense style={{marginLeft: "10px"}}>
                                        {section[1]?.map((theme: string) => {
                                            if (section[0] === chooseSection) {
                                                return (
                                                    <ListItem selected={theme === chooseTheme} key={theme} button
                                                              onClick={() => { helpCountNull(); setCount(0); setChooseTheme(theme); chooseSectionTheme(theme)}}>
                                                        <ListItemText disableTypography style={{fontFamily: 'Andale Mono, monospace', fontSize: '100%'}} primary={theme}/>
                                                    </ListItem>
                                                );
                                            } else {
                                                return (
                                                    <div>

                                                    </div>
                                                );
                                            }
                                        })}
                                    </List>
                                </Collapse>
                            </div>
                        );
                    })}
                </List>
            </List>
            <div>
                <Slide style={{position: "absolute", top: "60vh", left: "32vh"}} direction="right" in={openHelpSnake} mountOnEnter unmountOnExit>
                    <img src={images[Math.floor(Math.random()*images.length)]} alt={"cannot display"} style={{height: "30vh", marginLeft: "3vh"}}/>
                </Slide>
            </div>
            <div style={{display: isTeacher ? 'inline' : 'none'}}>
                <ButtonGroup size="large" color="primary" aria-label="outlined secondary button group">
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <ButtonGroup><Button size="large" color="primary"
                                                     aria-label="outlined secondary button group" {...bindTrigger(popupState)}><AddIcon/></Button></ButtonGroup>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={() => {
                                        addSection();
                                        popupState.close()
                                    }}>Добавить раздел</MenuItem>
                                    <MenuItem onClick={() => {
                                        addTheme();
                                        popupState.close()
                                    }}>Добавить тему</MenuItem>
                                </Menu>
                                <Dialog open={openAddSection} onClose={addSectionClose}
                                        aria-labelledby="form-dialog-title">
                                    <DialogContent>
                                        <DialogContentText>
                                            Введите название раздела
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Раздел"
                                            fullWidth
                                            value={nameSection}
                                            onChange={e => {
                                                setNameSection(e.target.value)
                                            }}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={addSectionClose} color="primary">
                                            Отменить
                                        </Button>
                                        <Button onClick={addSectionSave} color="primary">
                                            Сохранить
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                                <Dialog open={openAddTheme} onClose={addThemeClose} aria-labelledby="form-dialog-title">
                                    <DialogContent>
                                        <DialogContentText>
                                            Введите название темы
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            label="Тема"
                                            fullWidth
                                            value={nameTheme}
                                            onChange={e => {
                                                setNameTheme(e.target.value)
                                            }}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={addThemeClose} color="primary">
                                            Отменить
                                        </Button>
                                        <Button onClick={addThemeSave} color="primary">
                                            Сохранить
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </React.Fragment>
                        )}
                    </PopupState>
                    <Button onClick={deleteThemeOpen}><RemoveIcon/></Button>
                    <Dialog
                        open={deleteTheme}
                        onClose={deleteThemeClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {textForDelete}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={deleteThemeClose} color="primary">
                                Нет, я случайно нажал на эту кнопку!
                            </Button>
                            <Button onClick={deleteThemeAgree} color="primary" autoFocus>
                                Да, уничтожим её!
                            </Button>
                        </DialogActions>
                    </Dialog>
                </ButtonGroup>
            </div>
        </div>
    );
}