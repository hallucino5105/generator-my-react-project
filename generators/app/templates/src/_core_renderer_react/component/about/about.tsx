import React from "react";
import { observer } from "mobx-react";
import Style from "style-it";
import packageJson from "package.json";
import AppIcon from "src/assets/image/icon.png";
import { useStateStore } from "src/core_renderer/store";

const CenteringContainer = (props: any) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: "10px 0",
      ...props.style,
    }}
  >
    {props.children}
  </div>
);

export const About = observer(() => {
  const { theme } = useStateStore("stateTheme");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "5px",
        color: theme.about.color,
        backgroundColor: theme.about.backgroundColor,
        fontSize: "1rem",
        fontFamily: theme.fontFamily,
        fontWeight: theme.fontWeight,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          overflow: "hidden",
          cursor: "default",
          userSelect: "none",
          fontSize: "0.8rem",
        }}
      >
        <CenteringContainer
          style={{
            height: "45%",
            padding: "20px",
          }}
        >
          <img
            style={{
              width: "auto",
              height: "100%",
            }}
            src={AppIcon}
            alt="app icon"
          />
        </CenteringContainer>

        <CenteringContainer
          style={{
            fontWeight: theme.about.title.fontWeight,
            lineHeight: "1.5rem",
          }}
        >
          <div style={{ fontSize: "1.5rem" }}>{packageJson.name}</div>
          <div>{packageJson.description}</div>
        </CenteringContainer>

        <CenteringContainer
          style={{
            lineHeight: "1.2rem",
          }}
        >
          <div>{`Copyright (c) 2019 ${packageJson.author}`}</div>
          <div>{`Released under the ${packageJson.license} license`}</div>
        </CenteringContainer>

        <CenteringContainer style={{ fontSize: "0.75rem" }}>
          <Style>
            {`
            table, tr, td {
              border: none;
              border-spacing: 0;
              border-collapse: collapse;
            }

            td {
              line-height: 0.9rem;
            }
          `}

            <table>
              <tbody>
                <tr>
                  <td>Platform</td>
                  <td>
                    {process.platform} - {process.arch}
                  </td>
                </tr>
                <tr>
                  <td>Electron</td>
                  <td>{process.versions.electron}</td>
                </tr>
                <tr>
                  <td>Chrome</td>
                  <td>{process.versions.chrome}</td>
                </tr>
                <tr>
                  <td>Node</td>
                  <td>{process.versions.node}</td>
                </tr>
              </tbody>
            </table>
          </Style>
        </CenteringContainer>
      </div>
    </div>
  );
});

