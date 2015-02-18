LOAD({
	"name": "ork",
	"scale": 0.3,
	"above": [
		{
			"name": "body",
			"image": "image/scribble/ork-body.png",
			"pivot": {
				"x": 99,
				"y": 99
			},
			"rotate": 0,
			"scale": 1,
			"alpha": 1,
			"offset": {
				"x": -40,
				"y": -242
			},
			"above": [
				{
					"name": "snout",
					"image": "image/scribble/ork-snout.png",
					"pivot": {
						"x": 35,
						"y": 62
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 156,
						"y": 98
					},
					"above": [
						{
							"name": "mouth",
							"image": "image/scribble/ork-mouth.png",
							"pivot": {
								"x": 17,
								"y": 82
							},
							"rotate": -5,
							"scale": 1.2,
							"alpha": 1,
							"offset": {
								"x": 198,
								"y": 50
							},
							"above": [
								{
									"name": "bubble",
									"image": "image/scribble/bubble.png",
									"tag": "bubble",
									"pivot": {
										"x": 120,
										"y": 60
									},
									"rotate": 0,
									"scale": 1.5,
									"alpha": 1,
									"offset": {
										"x": 70,
										"y": 80
									}
								},
								{
									"name": "key",
									"image": "image/scribble/key.png",
									"tag": "key",
									"pivot": {
										"x": 100,
										"y": 30
									},
									"rotate": 0,
									"scale": 1.2,
									"alpha": 1,
									"offset": {
										"x": 70,
										"y": 80
									}
								}
							],
							"below": []
						}
					],
					"below": []
				},
				{
					"name": "eye1",
					"image": "image/scribble/ork-eye.png",
					"pivot": {
						"x": 75,
						"y": 89
					},
					"rotate": 0,
					"scale": 0.6,
					"alpha": 1,
					"offset": {
						"x": 84,
						"y": 60
					},
					"above": [
						{
							"name": "pupil1",
							"image": "image/scribble/ork-pupil.png",
							"pivot": {
								"x": 22,
								"y": 22
							},
							"rotate": 0,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 70,
								"y": 70
							},
							"above": [],
							"below": []
						}
					],
					"below": []
				}
			],
			"below": [
				{
					"name": "eye2",
					"image": "image/scribble/ork-eye.png",
					"pivot": {
						"x": 44,
						"y": 89
					},
					"rotate": 0,
					"scale": 0.6,
					"alpha": 1,
					"offset": {
						"x": 140,
						"y": 50
					},
					"above": [
						{
							"name": "pupil2",
							"image": "image/scribble/ork-pupil.png",
							"pivot": {
								"x": 22,
								"y": 22
							},
							"rotate": 0,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 72,
								"y": 52
							},
							"above": [],
							"below": []
						}
					],
					"below": []
				},
				{
					"name": "hair1",
					"image": "image/scribble/ork-hair1.png",
					"pivot": {
						"x": 137,
						"y": 42
					},
					"rotate": -7,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 40,
						"y": 54
					},
					"above": [],
					"below": []
				},
				{
					"name": "hair2",
					"image": "image/scribble/ork-hair2.png",
					"pivot": {
						"x": 140,
						"y": 36
					},
					"rotate": 31,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 38,
						"y": 52
					},
					"above": [],
					"below": []
				},
				{
					"name": "leg1",
					"image": "image/scribble/ork-leg1.png",
					"pivot": {
						"x": 34,
						"y": 15
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 130,
						"y": 148
					},
					"above": [
						{
							"name": "foot1",
							"image": "image/scribble/ork-foot1.png",
							"pivot": {
								"x": 64,
								"y": 60
							},
							"rotate": 0,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 48,
								"y": "164"
							},
							"above": [],
							"below": []
						}
					],
					"below": []
				},
				{
					"name": "leg2",
					"image": "image/scribble/ork-leg1.png",
					"pivot": {
						"x": 34,
						"y": 15
					},
					"rotate": 0,
					"scale": 1,
					"alpha": 1,
					"offset": {
						"x": 66,
						"y": 156
					},
					"above": [
						{
							"name": "foot2",
							"image": "image/scribble/ork-foot1.png",
							"pivot": {
								"x": 64,
								"y": 60
							},
							"rotate": 0,
							"scale": 1,
							"alpha": 1,
							"offset": {
								"x": 48,
								"y": 164
							},
							"above": [],
							"below": []
						}
					],
					"below": []
				}
			]
		}
	],
	"below": [],
	"pose": {}
});