import React, { useEffect, useRef, useState } from 'react';
import './Replay.less'
import { Link } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar';
import Marker from './Marker';

const Replay = () => {
  const workspaceRef = useRef(null);
  const [step, setStep] = useState(0);
  let playback;
  const setWorkspace = () => {
    workspaceRef.current = window.Blockly.inject('blockly-canvas',
        { toolbox: document.getElementById('toolbox') }
    );
  }
  const replay = [
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"341\" y=\"162\"></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "text": {
            "count": 4,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 1,
            "deleted": 0
          },
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          }
        },
        "categories": {}
      },
      "timestamp": 1638063003655
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "text": {
            "count": 4,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 1,
            "deleted": 0
          },
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          }
        },
        "categories": {}
      },
      "timestamp": 1638063004656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\" x=\"234\" y=\"69\"></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "text": {
            "count": 4,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 2,
            "deleted": 0
          },
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063006656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"></block></value></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "text": {
            "count": 4,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 2,
            "deleted": 0
          },
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063007655
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></value></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "text": {
            "count": 4,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063009656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></value></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"219\" y=\"231\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063011655
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></value></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063012656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></value></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block><block type=\"logic_ternary\" id=\"cS|eUvq#uzG2zi9)kgM(\" x=\"156\" y=\"435\"></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "logic_ternary": {
            "count": 1,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063014656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block><block type=\"logic_ternary\" id=\"cS|eUvq#uzG2zi9)kgM(\" x=\"156\" y=\"435\"></block><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\" x=\"280\" y=\"440\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "logic_ternary": {
            "count": 1,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063017656
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\" x=\"210\" y=\"80\"></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block><block type=\"logic_ternary\" id=\"cS|eUvq#uzG2zi9)kgM(\" x=\"156\" y=\"435\"><value name=\"IF\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"></block></value></block></value></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "logic_ternary": {
            "count": 1,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063018657
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block><block type=\"logic_ternary\" id=\"cS|eUvq#uzG2zi9)kgM(\" x=\"156\" y=\"435\"><value name=\"IF\"><block type=\"logic_negate\" id=\"2rd9d[778H)d}co;DRC1\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"@O|.:~vZQcnB/^]T2?9n\"><value name=\"BOOL\"><block type=\"logic_negate\" id=\"9ZPwPIW#.ufs|)tkH]j8\"></block></value></block></value></block></value></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 3,
            "deleted": 0
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "logic_ternary": {
            "count": 1,
            "deleted": 0
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063020659
    },
    {
      "xml": "<xml xmlns=\"http://www.w3.org/1999/xhtml\"><block type=\"serial_setup\" id=\"==lnHTRR]JGkBK?G3AOP\" x=\"64\" y=\"15\"><field name=\"SERIAL_ID\">Serial</field><field name=\"SPEED\">9600</field></block><block type=\"insert_comment\" id=\"Yn*{ZymirKA)ae4R-C|q\" x=\"79\" y=\"132\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"nK#9fq^CVa7I:/I];zX}\"><field name=\"TEXT\">What is Space?</field></block></value><value name=\"ADD1\"><block type=\"text\" id=\"gvGrrT/;`h66)oPZKH0(\"><field name=\"TEXT\">Enter your throughs below.</field></block></value><next><block type=\"variables_set\" id=\"O^st-FW@P,/J!,[woEF8\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text\" id=\"KWtg/,-sRF{Y(}-fkOy/\"><field name=\"TEXT\"></field></block></value></block></next></block><block type=\"logic_boolean\" id=\"s4nNDLU.^pN4BVHvoa5W\" x=\"207\" y=\"224\"><field name=\"BOOL\">TRUE</field></block><block type=\"variables_set\" id=\"x^3q5KAF|SM|nVOcyO!@\" x=\"78\" y=\"273\"><field name=\"VAR\">item</field><value name=\"VALUE\"><block type=\"text_join\" id=\"_/F=KUmsq[._y!8?Z2y#\"><mutation items=\"2\"></mutation><value name=\"ADD0\"><block type=\"text\" id=\"2qowzW*6d5zEA|7HR9Se\"><field name=\"TEXT\">My throughs on what is space is: </field></block></value><value name=\"ADD1\"><block type=\"variables_get\" id=\"Cul[O**vp@y44)5+LaF6\"><field name=\"VAR\">item</field></block></value></block></value><next><block type=\"serial_print\" id=\"fZavHX^s_]jLT*E}x4.4\"><field name=\"SERIAL_ID\">Serial</field><field name=\"NEW_LINE\">TRUE</field><value name=\"CONTENT\"><block type=\"variables_get\" id=\"pv+J1zT/e6QB1bWi}_KD\"><field name=\"VAR\">item</field></block></value></block></next></block></xml>",
      "xmlData": {
        "blocks": {
          "serial_print": {
            "count": 1,
            "deleted": 0
          },
          "logic_negate": {
            "count": 0,
            "deleted": 1
          },
          "logic_boolean": {
            "count": 1,
            "deleted": 0
          },
          "text": {
            "count": 4,
            "deleted": 0
          },
          "variables_get": {
            "count": 2,
            "deleted": 0
          },
          "serial_setup": {
            "count": 1,
            "deleted": 0
          },
          "insert_comment": {
            "count": 1,
            "deleted": 0
          },
          "variables_set": {
            "count": 2,
            "deleted": 0
          },
          "logic_ternary": {
            "count": 0,
            "deleted": 1
          },
          "text_join": {
            "count": 1,
            "deleted": 0
          }
        }
      },
      "timestamp": 1638063023658
    }
  ];

  const timeConverter = (timestamp) => {
    var dateVal = new Date(timestamp).toLocaleDateString('en-US');
    var a = new Date(timestamp * 1000);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = dateVal + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  };

  useEffect(() => {
    workspaceRef.current ? workspaceRef.current.clear() : setWorkspace();
    const xml = window.Blockly.Xml.textToDom(replay[step].xml);
    window.Blockly.Xml.domToWorkspace(xml, workspaceRef.current);
  }, [step]);

  const goBack = () => {
    setStep(step - 1);
  }
  // const play = () => {
  //   playback = setInterval(() => {
  //     console.log('firing');
  //     setStep(step + 1);
  //     console.log(step);
  //   }, 1000);
  // }
  const goForward = () => {
    setStep(step + 1);
  }

  return (
    <main className="container nav-padding">
      <NavBar />
      <div id="horizontal-container" className="flex flex-column">
        <div id="top-container" className="flex flex-column vertical-container">
          <div id="description-container" className="flex flex-row space-between card">
            <div className="flex flex-row">
              <Link id="link" to="/" className="flex flex-column">
                <i className="fa fa-home"/>
              </Link>
            </div>
            <div className="flex flex-row">
              <button className="replayButton" onClick={goBack} disabled={step === 0}>&#9198;</button>
              <button className="replayButton" disabled={playback}>&#9654;&#65039;</button>
              <button className="replayButton" onClick={goForward} disabled={step === (replay.length - 1)}>&#9197;</button>
            </div>
          </div>
        </div>
        <div className='flex flex-row'>
          <div id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h1 id="section-header">Code Replay</h1>
            <div id="blockly-canvas"/>
            <div id="timeline">
              { replay.map((item, index) => <div className={step === index ? 'bold' : null} key={item.timestamp}>{timeConverter(item.timestamp)}<Marker /></div>)}
            </div>
          </div>
        </div>
        <div className='flex flex-row'>
          <section id='bottom-container' className="flex flex-column vertical-container overflow-visible">
            <h2 id="section-header">Logs</h2>
            <div>
              { replay.map((item, index) => <p className={step === index ? 'bold' : null} key={item.timestamp}>{timeConverter(item.timestamp)}</p>)}
            </div>
          </section>
        </div>
      </div>
      <xml id="toolbox" is="Blockly workspace"></xml>
    </main>
  )
};

export default Replay;