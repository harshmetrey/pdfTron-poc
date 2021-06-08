import { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/webviewer'

import './App.css'

function App() {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: '/lib',
        initialDoc: '/Contract example (1).pdf',
        disabledElements: [
          'viewControlsButton',
          'viewControlsOverlay',
          'leftPanel',
          'leftPanelButton',
          'header',
          'signatureToolGroupButton',
          'stampToolGroupButton',
          'rubberStampToolGroupButton',
          'fileAttachmentToolGroupButton',
          'calloutToolGroupButton',
          'eraserToolButton',
          'redoButton',
          'undoButton',
          'toolsHeader'

        ]
      },
      viewer.current,
    ).then((instance) => {
      const { docViewer, annotManager, Annotations } = instance;
      const { WidgetFlags } = Annotations;

      Annotations.WidgetAnnotation.getContainerCustomStyles = widget => {
        if (widget instanceof Annotations.TextWidgetAnnotation) {
          // can check widget properties
          if (widget) {
            return {
              'border': 'none'
            };
          }
        } else if (widget instanceof Annotations.SignatureWidgetAnnotation) {
          return {

            'border': 'none'

          }
        }
      };

      const flags = new WidgetFlags();
      flags.set('Multiline', true);
      flags.set('Required', true);

      document.getElementById('pdfBlob').addEventListener('click', async () => {
        const doc = docViewer.getDocument();
        const xfdfString = await annotManager.exportAnnotations();
        const data = await doc.getFileData({
          // saves the document with annotations in it
          xfdfString
        });
        const arr = new Uint8Array(data);
        const blob = new Blob([arr], { type: 'application/pdf' });
        console.log(blob)
      })

      document.getElementById('download').addEventListener('click', () => {
        // download pdf with all annotations flattened
        instance.downloadPdf({
          includeAnnotations: true,
          flatten: true,
        });
      });

      // myBtn is your own custom button
      document.getElementById('purchaser').addEventListener('click', (e) => {
        console.log(e)
        // create a form field
        const field = new Annotations.Forms.Field("purchaser", {
          type: 'Tx',
          name: 'purchaser',
          flags,
          value: e.target.firstChild.data,
        });

        // create a widget annotation
        const widgetAnnot = new Annotations.TextWidgetAnnotation(field);

        // set position and size
        widgetAnnot.PageNumber = 1;
        widgetAnnot.X = 80;
        widgetAnnot.Y = 470;
        widgetAnnot.Width = 120;
        widgetAnnot.Height = 20;

        //add the form field and widget annotation
        annotManager.addAnnotation(widgetAnnot);
        annotManager.drawAnnotationsFromList([widgetAnnot]);
        annotManager.getFieldManager().addField(field);
      });

      document.getElementById('email').addEventListener('click', (e) => {
        // create a form field
        const field = new Annotations.Forms.Field("email", {
          type: 'Tx',
          name: "email",
          flags,
          value: e.target.firstChild.data
        });

        // create a widget annotation
        const widgetAnnot = new Annotations.TextWidgetAnnotation(field);


        // set position and size
        widgetAnnot.PageNumber = 1;
        widgetAnnot.X = 447;
        widgetAnnot.Y = 535;
        widgetAnnot.Width = 120;
        widgetAnnot.Height = 15;

        //add the form field and widget annotation
        annotManager.addAnnotation(widgetAnnot);
        annotManager.drawAnnotationsFromList([widgetAnnot]);
        annotManager.getFieldManager().addField(field);
      });

      // myBtn is your own custom button
      document.getElementById('sign').addEventListener('click', () => {

        // set flags for required
        const flags = new WidgetFlags();
        flags.set('Required', true);

        // create a form field
        const field = new Annotations.Forms.Field("sign", {
          type: 'Sig',
          flags,
        });

        // create a widget annotation
        const widgetAnnot = new Annotations.SignatureWidgetAnnotation(field, {
          appearance: '_DEFAULT',
          appearances: {
            _DEFAULT: {
              Normal: {
                data:
                  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjEuMWMqnEsAAAANSURBVBhXY/j//z8DAAj8Av6IXwbgAAAAAElFTkSuQmCC',
                offset: {
                  x: 100,
                  y: 100,
                },
              },
            },
          },
        });

        // set position and size
        widgetAnnot.PageNumber = 1;
        widgetAnnot.X = 100;
        widgetAnnot.Y = 725;
        widgetAnnot.Width = 50;
        widgetAnnot.Height = 20;

        //add the form field and widget annotation
        annotManager.addAnnotation(widgetAnnot);
        annotManager.drawAnnotationsFromList([widgetAnnot]);
        annotManager.getFieldManager().addField(field);
      });


    });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="column">
          <div className="Pdf-viewer">
            <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
          </div>
        </div>
        <div className="column">
          <div className="user-option-wrapper">
            <h3>Click on the Below Options to Fill the PDF with Information.</h3>
            <h2>Purchaser</h2>
            <div className="row">
              <div className="column">
                <button className="btn" id="purchaser" name="purchaser">
                  <div className="btn-title" name="Berty Bhuruth">Berty Bhuruth</div>
                  <label className="btn-subtitle">Purchaser Name</label>
                </button>
              </div>
              <div className="column">
                <button className="btn" id="sign" name="sign">
                  <div className="btn-title" name="sign">Sign Here</div>
                  <label className="btn-subtitle">Purchaser Signature</label>
                </button>
              </div>

            </div>
            <h2>Solicitor / Conveyancer</h2>
            <button className="btn" id="email" name="email">
              <div className="btn-title">Danny+sandler@contrax.com
                </div>
              <label className="btn-subtitle">Email</label>
            </button>
            <h3>Download/Save</h3>
            <button className="btn" id="download" name="download">Download</button>
            <p />
            <button className="btn" id="pdfBlob" name="download">Save Contract</button>

          </div>
        </div>
      </div>
    </div>

  );
};

export default App;